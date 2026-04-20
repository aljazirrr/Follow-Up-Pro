"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/actions/billing";
import { useTranslation } from "@/lib/i18n/client";

export function UpgradeButton({ configured }: { configured: boolean }) {
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const b = t.billing;

  async function onClick() {
    setPending(true);
    const res = await startCheckout();
    if (res && !res.ok) {
      setPending(false);
      toast.error(res.error);
    }
  }

  if (!configured) {
    return (
      <div className="space-y-2">
        <Button disabled>{b.upgradeBtn}</Button>
        <p className="text-xs text-muted-foreground">
          {b.stripeNotConfigured}
        </p>
      </div>
    );
  }

  return (
    <Button onClick={onClick} disabled={pending}>
      {pending ? b.redirecting : b.upgradeBtn}
    </Button>
  );
}
