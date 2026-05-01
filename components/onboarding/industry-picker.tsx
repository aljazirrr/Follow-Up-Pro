"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wrench, Car, Scissors, Settings2, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/actions/onboarding";
import { useTranslation } from "@/lib/i18n/client";
import type { LucideIcon } from "lucide-react";

type IndustryOption = {
  key: string;
  icon: LucideIcon;
};

const INDUSTRIES: IndustryOption[] = [
  { key: "INSTALLER", icon: Wrench },
  { key: "DETAILER", icon: Car },
  { key: "SALON", icon: Scissors },
  { key: "REPAIR", icon: Settings2 },
  { key: "OTHER", icon: Briefcase },
];

export function IndustryPicker() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const labels = t.onboarding.industries;

  async function onContinue() {
    if (!selected) return;
    setSubmitting(true);
    const res = await completeOnboarding(selected);
    if (!res.ok) {
      setSubmitting(false);
      toast.error(res.error);
      return;
    }
    toast.success(t.onboarding.success);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {INDUSTRIES.map(({ key, icon: Icon }) => {
          const industry = labels[key as keyof typeof labels];
          return (
            <Card
              key={key}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                selected === key && "border-primary bg-primary/5"
              )}
              onClick={() => setSelected(key)}
            >
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  selected === key ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{industry.label}</p>
                  <p className="text-sm text-muted-foreground">{industry.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!selected || submitting}
          onClick={onContinue}
        >
          {submitting ? t.onboarding.applying : t.onboarding.continue}
        </Button>
      </div>
    </div>
  );
}
