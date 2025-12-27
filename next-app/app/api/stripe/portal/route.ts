import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
import { rateLimit } from "@/server/rate-limit";
import { stripe } from "@/server/stripe";

const portalSchema = z.object({
  returnUrl: z.string().url().optional()
});

const resolveReturnUrl = (request: Request, body: z.infer<typeof portalSchema>) => {
  const origin = new URL(request.url).origin;
  return body.returnUrl ?? process.env.STRIPE_PORTAL_RETURN_URL ?? `${origin}/billing`;
};

export async function POST(request: Request) {
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

  const limiter = rateLimit(`stripe:portal:${user.id}`, {
    limit: 5,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many portal requests" },
      {
        status: 429,
        headers: {
          "RateLimit-Limit": "5",
          "RateLimit-Remaining": String(limiter.remaining),
          "RateLimit-Reset": String(limiter.resetAt)
        }
      }
    );
  }

  let payload: unknown = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }
  const parsed = portalSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: {
        userId: user.id
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id }
    });

    customerId = customer.id;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: resolveReturnUrl(request, parsed.data)
  });

  return NextResponse.json(
    { url: portalSession.url },
    {
      headers: {
        "RateLimit-Limit": "5",
        "RateLimit-Remaining": String(limiter.remaining),
        "RateLimit-Reset": String(limiter.resetAt)
      }
    }
  );
}
