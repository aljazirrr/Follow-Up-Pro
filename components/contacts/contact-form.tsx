"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LeadSource } from "@prisma/client";
import { createContact, updateContact } from "@/actions/contacts";

type Props = {
  mode: "create" | "edit";
  initial?: {
    id?: string;
    fullName?: string;
    phone?: string | null;
    email?: string | null;
    companyName?: string | null;
    serviceType?: string | null;
    source?: LeadSource;
    notes?: string | null;
  };
};

export function ContactForm({ mode, initial }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res =
      mode === "create"
        ? await createContact(fd)
        : await updateContact(initial!.id!, fd);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(mode === "create" ? "Contact created" : "Contact updated");
    const id = (res as { id?: string }).id ?? initial?.id;
    router.push(`/contacts/${id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="fullName">Full name *</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          defaultValue={initial?.fullName ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initial?.email ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={initial?.phone ?? ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Company</Label>
        <Input
          id="companyName"
          name="companyName"
          defaultValue={initial?.companyName ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="serviceType">Service type</Label>
        <Input
          id="serviceType"
          name="serviceType"
          placeholder="e.g. Auto detailing"
          defaultValue={initial?.serviceType ?? ""}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="source">Source</Label>
        <Select
          id="source"
          name="source"
          defaultValue={initial?.source ?? LeadSource.MANUAL}
        >
          {Object.values(LeadSource).map((s) => (
            <option key={s} value={s}>
              {s.toLowerCase()}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} defaultValue={initial?.notes ?? ""} />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create contact" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
