"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/actions/feedback";
import { useTranslation } from "@/lib/i18n/client";

export function FeedbackForm() {
  const { t } = useTranslation();
  const f = t.feedback;
  const pathname = usePathname();

  const [type, setType] = useState<"bug" | "confusing" | "idea">("idea");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData();
    fd.set("type", type);
    fd.set("message", message);
    fd.set("pathname", pathname);
    const res = await submitFeedback(fd);
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(f.success);
    setMessage("");
    setType("idea");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="feedback-type" className="text-xs uppercase tracking-wide text-muted-foreground">
          {f.typeLabel}
        </label>
        <Select
          id="feedback-type"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="bug">{f.typeBug}</option>
          <option value="confusing">{f.typeConfusing}</option>
          <option value="idea">{f.typeIdea}</option>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="feedback-message" className="text-xs uppercase tracking-wide text-muted-foreground">
          {f.messageLabel}
        </label>
        <Textarea
          id="feedback-message"
          rows={4}
          placeholder={f.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={1000}
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? f.submitting : f.submit}
      </Button>
    </form>
  );
}
