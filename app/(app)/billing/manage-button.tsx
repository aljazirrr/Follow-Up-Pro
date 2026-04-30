"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createPortalSession } from "@/actions/billing";
import { useTranslation } from "@/lib/i18n/client";

export function ManageSubscriptionButton() {
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const b = t.billing;

  async function onClick() {
    setPending(true);
    const res = await createPortalSession();
    setPending(false);
    if (!res.ok) {
      toast.error(b.portalUnavailable);
      return;
    }
    if (res.url) {
      window.location.href = res.url;
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      {pending ? b.managingSubscription : b.manageSubscription}
    </Button>
  );
}
