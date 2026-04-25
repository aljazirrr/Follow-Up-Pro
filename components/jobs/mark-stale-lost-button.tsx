"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllStaleAsLost } from "@/actions/jobs";
import { useTranslation } from "@/lib/i18n/client";

export function MarkStaleLostButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const j = t.jobs;

  if (count === 0) return null;

  async function onClick() {
    const confirmed = window.confirm(
      j.markStaleAsLostConfirm.replace("{count}", String(count))
    );
    if (!confirmed) return;

    setPending(true);
    const res = await markAllStaleAsLost();
    setPending(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(j.staleMarkedLost.replace("{count}", String(res.count ?? count)));
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" onClick={onClick} disabled={pending}>
      <Trash2 className="h-4 w-4" />
      {j.markStaleAsLost.replace("{count}", String(count))}
    </Button>
  );
}
