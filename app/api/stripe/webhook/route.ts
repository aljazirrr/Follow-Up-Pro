import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import type { SubscriptionStatus, PlanType } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapStatus(s: Stripe.Subscription.Status): SubscriptionStatus {
  switch (s) {
    case "active":
      return "ACTIVE";
    case "canceled":
    case "unpaid":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    case "incomplete":
    case "incomplete_expired":
    default:
      return "INCOMPLETE";
  }
}

function mapPlan(status: SubscriptionStatus): PlanType {
  return status === "ACTIVE" || status === "TRIALING" ? "PRO" : "FREE";
}

async function upsertSubscriptionForUser(userId: string, sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const status = mapStatus(sub.status);
  const plan = mapPlan(status);

  console.log("[stripe webhook] upsertSubscriptionForUser");
  console.log("[stripe webhook] userId:", userId);
  console.log("[stripe webhook] stripeSubscriptionId:", sub.id);
  console.log("[stripe webhook] stripeCustomerId:", customerId);
  console.log("[stripe webhook] stripeStatus:", sub.status);
  console.log("[stripe webhook] mappedStatus:", status);
  console.log("[stripe webhook] mappedPlan:", plan);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0]?.price?.id ?? null,
      status,
      plan,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0]?.price?.id ?? null,
      status,
      plan,
    },
  });

  console.log("[stripe webhook] upsert success for user:", userId);
}

async function syncSubscriptionByCustomer(sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  console.log("[stripe webhook] syncSubscriptionByCustomer");
  console.log("[stripe webhook] customerId:", customerId);
  console.log("[stripe webhook] subscriptionId:", sub.id);
  console.log("[stripe webhook] stripeStatus:", sub.status);

  const existing = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  console.log("[stripe webhook] existing row:", existing?.id ?? null);

  if (!existing) {
    console.warn("[stripe webhook] No subscription row for customer", customerId);
    return;
  }

  const status = mapStatus(sub.status);
  const plan = mapPlan(status);

  console.log("[stripe webhook] updating existing subscription row");
  console.log("[stripe webhook] mappedStatus:", status);
  console.log("[stripe webhook] mappedPlan:", plan);

  await prisma.subscription.update({
    where: { id: existing.id },
    data: {
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0]?.price?.id ?? null,
      status,
      plan,
    },
  });

  console.log("[stripe webhook] update success for row:", existing.id);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe webhook] missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("[stripe webhook] missing stripe-signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe webhook] signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log("[stripe webhook] event type:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("[stripe webhook] checkout.session.completed");

        const session = event.data.object as Stripe.Checkout.Session;

        console.log("[stripe webhook] session id:", session.id);
        console.log("[stripe webhook] metadata:", session.metadata);
        console.log("[stripe webhook] session subscription:", session.subscription);
        console.log("[stripe webhook] session customer:", session.customer);

        const userId = session.metadata?.userId;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        console.log("[stripe webhook] extracted userId:", userId);
        console.log("[stripe webhook] extracted subscriptionId:", subscriptionId);

        if (!userId || !subscriptionId) {
          console.warn("[stripe webhook] Missing userId or subscriptionId", {
            userId,
            subscriptionId,
          });
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        console.log("[stripe webhook] retrieved subscription from Stripe:", sub.id);

        await upsertSubscriptionForUser(userId, sub);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        console.log("[stripe webhook] customer.subscription.created/updated");
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscriptionByCustomer(sub);
        break;
      }

      case "customer.subscription.deleted": {
        console.log("[stripe webhook] customer.subscription.deleted");

        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        console.log("[stripe webhook] deleting subscription for customer:", customerId);

        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "FREE",
            status: "CANCELED",
            stripeSubscriptionId: null,
            stripePriceId: null,
            currentPeriodEnd: null,
          },
        });

        console.log("[stripe webhook] delete sync success for customer:", customerId);
        break;
      }

      default:
        console.log("[stripe webhook] ignored event:", event.type);
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
