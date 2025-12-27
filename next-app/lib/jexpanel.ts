import { z } from "zod";

import { prisma } from "@/server/prisma";

const linkResponseSchema = z
  .object({
    jexpanelUserId: z.string().optional(),
    id: z.string().optional()
  })
  .refine((value) => Boolean(value.jexpanelUserId ?? value.id), {
    message: "Missing jexpanel user id"
  });

type LinkInput = {
  email: string | null;
  name: string | null;
};

export async function ensureJexpanelLink(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      jexpanelUserId: true,
      email: true,
      name: true
    }
  });

  if (!user || user.jexpanelUserId) {
    return;
  }

  const jexpanelUserId = await requestJexpanelLink({
    email: user.email,
    name: user.name
  });

  if (!jexpanelUserId) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { jexpanelUserId }
  });
}

async function requestJexpanelLink(input: LinkInput): Promise<string | null> {
  const baseUrl = process.env.JEXPANEL_API_URL;
  const apiKey = process.env.JEXPANEL_API_KEY;

  if (!baseUrl || !apiKey || !input.email) {
    return null;
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/users/link`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    return null;
  }

  const payload = linkResponseSchema.safeParse(await response.json());
  if (!payload.success) {
    return null;
  }

  return payload.data.jexpanelUserId ?? payload.data.id ?? null;
}
