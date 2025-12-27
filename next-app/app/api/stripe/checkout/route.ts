import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma";
import { rateLimit } from "@/server/rate-limit";
import { stripe } from "@/server/stripe";

const checkoutSchema = z.object({
  mode: z.enum(["subscription", "one_time"]),
  quantity: z.number().int().min(1).max(10).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

const resolveCheckoutUrls = (request: Request, body: z.infer<typeof checkoutSchema>) => {
  const origin = new URL(request.url).origin;
  return {
    successUrl: body.successUrl ?? process.env.STRIPE_SUCCESS_URL ?? `${origin}/billing/success`,
    cancelUrl: body.cancelUrl ?? process.env.STRIPE_CANCEL_URL ?? `${origin}/billing/cancel`
  };
};

const ensureCustomer = async (user: { id: string; email: string | null; stripeCustomerId: string | null }) => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

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

  return customer.id;
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

  const limiter = rateLimit(`stripe:checkout:${user.id}`, {
    limit: 5,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts" },
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

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { mode, quantity } = parsed.data;
  const priceId =
    mode === "subscription"
      ? process.env.STRIPE_SUBSCRIPTION_PRICE_ID
      : process.env.STRIPE_ONE_TIME_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Stripe price is not configured" }, { status: 500 });
  }

  const customerId = await ensureCustomer(user);
  const { successUrl, cancelUrl } = resolveCheckoutUrls(request, parsed.data);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: mode === "subscription" ? "subscription" : "payment",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: quantity ?? 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    client_reference_id: user.id,
    subscription_data:
      mode === "subscription"
        ? {
            metadata: {
              userId: user.id
            }
          }
        : undefined,
    payment_intent_data:
      mode === "one_time"
        ? {
            metadata: {
              userId: user.id
            }
          }
        : undefined
  });

  return NextResponse.json(
    { url: checkoutSession.url },
    {
      headers: {
        "RateLimit-Limit": "5",
        "RateLimit-Remaining": String(limiter.remaining),
        "RateLimit-Reset": String(limiter.resetAt)
      }
    }
  );
}
