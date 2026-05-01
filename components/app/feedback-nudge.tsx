"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/client";

const DISMISSED_KEY = "rebooker:feedback-nudge-dismissed";

export function FeedbackNudge() {
  const { t } = useTranslation();
  const f = t.feedback;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-start gap-3 pt-4 pb-4">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1 text-sm">
          <p className="font-medium">{f.nudgeTitle}</p>
          <p className="mt-0.5 text-muted-foreground">{f.nudgeBody}</p>
          <Link
            href="/settings#feedback"
            className={buttonVariants({ size: "sm", variant: "outline" }) + " mt-3"}
            onClick={dismiss}
          >
            {f.nudgeCta}
          </Link>
        </div>
        <button
          onClick={dismiss}
          aria-label={f.nudgeDismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
