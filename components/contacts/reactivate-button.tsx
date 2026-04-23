"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reactivateContact } from "@/actions/contacts";
import { useTranslation } from "@/lib/i18n/client";

export function ReactivateButton({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  async function onClick() {
    setPending(true);
    const res = await reactivateContact(contactId);
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(t.contacts.reactivated);
    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={pending}>
      <RotateCcw className="h-4 w-4" />
      {t.contacts.reactivate}
    </Button>
  );
}
