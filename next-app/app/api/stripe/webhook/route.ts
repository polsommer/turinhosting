import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/server/prisma";
import { rateLimit } from "@/server/rate-limit";
import { stripe } from "@/server/stripe";

const upsertSubscription = async (subscription: Stripe.Subscription) => {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const user = await prisma.user.findFirst({
    where: {
      stripeCustomerId: customerId
    }
  });

  if (!user) {
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null
    },
    update: {
      status: subscription.status,
      priceId,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null
    }
  });
};

export async function POST(request: Request) {
  const limiter = rateLimit("stripe:webhook", {
    limit: 60,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many webhook requests" },
      {
        status: 429,
        headers: {
          "RateLimit-Limit": "60",
          "RateLimit-Remaining": String(limiter.remaining),
          "RateLimit-Reset": String(limiter.resetAt)
        }
      }
    );
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json(
    { received: true },
    {
      headers: {
        "RateLimit-Limit": "60",
        "RateLimit-Remaining": String(limiter.remaining),
        "RateLimit-Reset": String(limiter.resetAt)
      }
    }
  );
}
