"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/actions/billing";

export function UpgradeButton({ configured }: { configured: boolean }) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    const res = await startCheckout();
    // If redirect succeeded, we never reach here.
    if (res && !res.ok) {
      setPending(false);
      toast.error(res.error);
    }
  }

  if (!configured) {
    return (
      <div className="space-y-2">
        <Button disabled>Upgrade to Pro</Button>
        <p className="text-xs text-muted-foreground">
          Stripe isn't configured. Set <code>STRIPE_SECRET_KEY</code> and{" "}
          <code>NEXT_PUBLIC_STRIPE_PRICE_PRO</code> in <code>.env</code>.
        </p>
      </div>
    );
  }

  return (
    <Button onClick={onClick} disabled={pending}>
      {pending ? "Redirecting…" : "Upgrade to Pro"}
    </Button>
  );
}
