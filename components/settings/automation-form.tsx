"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAutomationSettings } from "@/actions/settings";
import { useTranslation } from "@/lib/i18n/client";

interface Props {
  quoteFollowUpDays: number;
  reviewRequestDays: number;
}

export function AutomationForm({ quoteFollowUpDays, reviewRequestDays }: Props) {
  const { t } = useTranslation();
  const s = t.settings;

  const [quote, setQuote] = useState(quoteFollowUpDays);
  const [review, setReview] = useState(reviewRequestDays);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await updateAutomationSettings({
      quoteFollowUpDays: quote,
      reviewRequestDays: review,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(s.automationSaved);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="quoteFollowUpDays" className="text-xs uppercase tracking-wide text-muted-foreground">
            {s.quoteFollowUpDays}
          </label>
          <Input
            id="quoteFollowUpDays"
            type="number"
            min={1}
            max={30}
            value={quote}
            onChange={(e) => setQuote(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reviewRequestDays" className="text-xs uppercase tracking-wide text-muted-foreground">
            {s.reviewRequestDays}
          </label>
          <Input
            id="reviewRequestDays"
            type="number"
            min={1}
            max={30}
            value={review}
            onChange={(e) => setReview(Number(e.target.value))}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{s.automationNote}</p>
      <Button type="submit" size="sm" disabled={pending}>
        {s.save}
      </Button>
    </form>
  );
}
