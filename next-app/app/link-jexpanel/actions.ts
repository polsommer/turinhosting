"use server";

import { prisma } from "@/server/prisma";
import { auth } from "@/auth";
import { linkJexpanelSchema } from "@/lib/validators/auth";
import { rateLimit } from "@/server/rate-limit";
import { getClientIp } from "@/server/request";

export type LinkJexpanelState = {
  error?: string;
};

export async function linkJexpanelAction(
  _prevState: LinkJexpanelState,
  formData: FormData
): Promise<LinkJexpanelState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to link your account." };
  }

  const parsed = linkJexpanelSchema.safeParse({
    jexpanelUserId: formData.get("jexpanelUserId")
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid Jexpanel user ID." };
  }

  const rate = await rateLimit({
    key: `auth:link:${getClientIp()}`,
    limit: 5,
    windowMs: 60_000
  });

  if (!rate.allowed) {
    return { error: "Too many attempts. Please try again shortly." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { jexpanelUserId: parsed.data.jexpanelUserId }
    });
  } catch (error) {
    return { error: "This Jexpanel user ID is already linked." };
  }

  return {};
}
