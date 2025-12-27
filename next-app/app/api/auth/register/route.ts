import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { rateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";
import { signUpSchema } from "@/lib/validators";
import { prisma } from "@/server/prisma";

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const rate = await rateLimit({
    key: `auth:register:${ip}`,
    limit: 5,
    windowSec: 60
  });

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again soon." },
      {
        status: 429,
        headers: {
          "Retry-After": rate.retryAfter.toString()
        }
      }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid payload",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const { email, name, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account already exists for this email." },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
