import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
import { rateLimit } from "@/server/rate-limit";

export async function GET(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limiter = rateLimit(`stripe:invoices:${user.id}`, {
    limit: 10,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many invoice requests" },
      {
        status: 429,
        headers: {
          "RateLimit-Limit": "10",
          "RateLimit-Remaining": String(limiter.remaining),
          "RateLimit-Reset": String(limiter.resetAt)
        }
      }
    );
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { invoices: [], message: "No Stripe customer is associated yet." },
      {
        headers: {
          "RateLimit-Limit": "10",
          "RateLimit-Remaining": String(limiter.remaining),
          "RateLimit-Reset": String(limiter.resetAt)
        }
      }
    );
  }

  return NextResponse.json(
    {
      invoices: [],
      message: "Invoice listing is a stub. Replace with Stripe invoice fetch when ready."
    },
    {
      headers: {
        "RateLimit-Limit": "10",
        "RateLimit-Remaining": String(limiter.remaining),
        "RateLimit-Reset": String(limiter.resetAt)
      }
    }
  );
}
