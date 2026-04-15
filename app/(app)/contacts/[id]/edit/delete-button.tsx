"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteContact } from "@/actions/contacts";

export function DeleteContactButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this contact and all related jobs and follow-ups?")) return;
    setPending(true);
    const res = await deleteContact(id);
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Contact deleted");
    router.push("/contacts");
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onDelete}
      disabled={pending}
      className="text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}
