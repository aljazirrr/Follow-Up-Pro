"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/client";

const DISMISSED_KEY = "rebooker:activation-dismissed";

export function PostActivationCard() {
  const { t } = useTranslation();
  const a = t.dashboard.activated;
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
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
      <CardContent className="flex items-start gap-3 pt-4 pb-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
        <div className="flex-1 text-sm">
          <p className="font-medium">{a.title}</p>
          <p className="mt-0.5 text-muted-foreground">{a.body}</p>
        </div>
        <button
          onClick={dismiss}
          aria-label={a.dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
