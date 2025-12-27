"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/server/rate-limit";
import { getClientIp } from "@/server/request";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid credentials" };
  }

  const rate = await rateLimit({
    key: `auth:login:${getClientIp()}`,
    limit: 5,
    windowMs: 60_000
  });

  if (!rate.allowed) {
    return { error: "Too many login attempts. Please try again shortly." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}
