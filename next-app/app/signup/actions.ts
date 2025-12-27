"use server";

import { hash } from "bcryptjs";

import { prisma } from "@/server/prisma";
import { signIn } from "@/auth";
import { signupSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/server/rate-limit";
import { getClientIp } from "@/server/request";

export type SignupState = {
  error?: string;
};

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid signup details." };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const rate = await rateLimit({
    key: `auth:signup:${getClientIp()}`,
    limit: 3,
    windowMs: 60_000
  });

  if (!rate.allowed) {
    return { error: "Too many signup attempts. Please try again shortly." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash
    }
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/dashboard"
  });

  return {};
}
