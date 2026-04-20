"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { JobStatus } from "@prisma/client";
import { createJob } from "@/actions/jobs";
import { useTranslation } from "@/lib/i18n/client";

export function JobForm({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const j = t.jobs;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.set("contactId", contactId);
    const res = await createJob(fd);
    setSubmitting(false);
    if (!res.ok) { toast.error(res.error); return; }
    toast.success(j.jobCreated);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        {j.newJob}
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border bg-muted/20 p-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">{j.titleLabel}</Label>
        <Input id="title" name="title" required placeholder={j.titlePlaceholder} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="estimatedValue">{j.estimatedValue}</Label>
          <Input id="estimatedValue" name="estimatedValue" inputMode="decimal" placeholder="0.00" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">{j.currency}</Label>
          <Input id="currency" name="currency" defaultValue="EUR" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="status">{j.initialStatus}</Label>
        <Select id="status" name="status" defaultValue={JobStatus.NEW}>
          {Object.values(JobStatus).map((s) => (
            <option key={s} value={s}>{t.status.job[s]}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">{j.description}</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? j.saving : j.createJob}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          {j.cancel}
        </Button>
      </div>
    </form>
  );
}
