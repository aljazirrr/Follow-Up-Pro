"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { skipAllOverdueTasks } from "@/actions/followups";
import { useTranslation } from "@/lib/i18n/client";

export function SkipOverdueButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const f = t.followups;

  if (count === 0) return null;

  async function onClick() {
    const confirmed = window.confirm(
      f.skipOverdueConfirm.replace("{count}", String(count))
    );
    if (!confirmed) return;

    setPending(true);
    const res = await skipAllOverdueTasks();
    setPending(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(f.skipOverdueSuccess.replace("{count}", String(res.count)));
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      <SkipForward className="h-4 w-4" />
      {f.skipOverdue.replace("{count}", String(count))}
    </Button>
  );
}
