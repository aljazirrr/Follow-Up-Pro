"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_PLACEHOLDERS } from "@/lib/templates";
import { upsertTemplate, resetTemplate } from "@/actions/templates";
import type { TaskType } from "@prisma/client";

type Props = {
  type: TaskType;
  name: string;
  subject: string;
  body: string;
};

export function TemplateEditor({ type, name, subject, body }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [s, setS] = useState(subject);
  const [b, setB] = useState(body);
  const [n, setN] = useState(name);

  async function onSave() {
    setSubmitting(true);
    const fd = new FormData();
    fd.set("type", type);
    fd.set("name", n);
    fd.set("subject", s);
    fd.set("body", b);
    const res = await upsertTemplate(fd);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Template saved");
    router.refresh();
  }

  async function onReset() {
    setSubmitting(true);
    const res = await resetTemplate(type);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Template reset to default");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        <span className="text-xs text-muted-foreground mr-1">Placeholders:</span>
        {SUPPORTED_PLACEHOLDERS.map((p) => (
          <Badge key={p} variant="muted">{`{{${p}}}`}</Badge>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Input value={s} onChange={(e) => setS(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Body</Label>
        <Textarea
          value={b}
          onChange={(e) => setB(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={submitting}>
          {submitting ? "Saving…" : "Save template"}
        </Button>
        <Button variant="outline" onClick={onReset} disabled={submitting}>
          Reset to default
        </Button>
      </div>
    </div>
  );
}
