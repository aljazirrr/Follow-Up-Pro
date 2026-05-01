"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllManualTodayDone } from "@/actions/followups";
import { useTranslation } from "@/lib/i18n/client";

export function MarkManualDoneButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const f = t.followups;

  if (count === 0) return null;

  async function onClick() {
    const confirmed = window.confirm(
      f.markManualDoneConfirm.replace("{count}", String(count))
    );
    if (!confirmed) return;

    setPending(true);
    const res = await markAllManualTodayDone();
    setPending(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    if (res.count === 0) {
      toast.success(f.markManualDoneNoop);
    } else {
      toast.success(f.markManualDoneSuccess.replace("{count}", String(res.count)));
    }
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      <Check className="h-4 w-4" />
      {f.markManualDone.replace("{count}", String(count))}
    </Button>
  );
}
