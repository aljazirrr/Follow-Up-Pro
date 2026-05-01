import "server-only";
import { prisma } from "./db";
import { getStripe, STRIPE_CONFIGURED } from "./stripe";
import { log } from "./logger";

/**
 * Pulls the current subscription state from Stripe and writes it to the DB.
 * Called defensively on the billing page after a successful checkout, so the
 * plan is always up-to-date even when webhook delivery is delayed or the
 * subscription row didn't exist yet when the first webhook fired.
 */
export async function syncSubscriptionFromStripe(userId: string): Promise<void> {
  if (!STRIPE_CONFIGURED) return;

  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub?.stripeCustomerId) return;

  const stripe = getStripe();
  try {
    const { data: activeSubs } = await stripe.subscriptions.list({
      customer: sub.stripeCustomerId,
      status: "active",
      limit: 1,
    });

    const active = activeSubs[0];
    if (active) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          plan: "PRO",
          status: "ACTIVE",
          stripeSubscriptionId: active.id,
          stripePriceId: active.items.data[0]?.price?.id ?? null,
          currentPeriodEnd: new Date(active.current_period_end * 1000),
        },
      });
      log("stripe", "subscription_synced_on_load", { userId, subscriptionId: active.id });
      return;
    }

    // No active subscription found — if DB still says PRO, downgrade to FREE
    // so the UI reflects reality (e.g. payment failed after initial success).
    if (sub.plan === "PRO") {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { plan: "FREE", status: "CANCELED" },
      });
      log("stripe", "subscription_downgraded_on_load", { userId });
    }
  } catch (err) {
    // Never block the billing page for a sync error — log and continue.
    log("stripe", "sync_error", {
      userId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
