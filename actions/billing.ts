"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getStripe, STRIPE_CONFIGURED } from "@/lib/stripe";

type ActionResult = { ok: true; url?: string } | { ok: false; error: string };

export async function startCheckout(): Promise<ActionResult> {
  const user = await requireUser();
  if (!STRIPE_CONFIGURED) {
    return {
      ok: false,
      error:
        "Stripe is not configured. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PRICE_PRO to enable upgrades.",
    };
  }

  const stripe = getStripe();
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });

  let customerId = sub?.stripeCustomerId ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, stripeCustomerId: customerId, plan: "FREE" },
      update: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?status=success`,
    cancel_url: `${appUrl}/billing?status=cancel`,
    metadata: { userId: user.id },
  });

  if (!session.url) return { ok: false, error: "Failed to create checkout" };
  redirect(session.url);
}
