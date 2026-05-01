import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface Step {
  label: string;
  done: boolean;
  href: string;
}

export function ActivationChecklist({
  onboardingCompleted,
  firstContactCreatedAt,
  firstJobCreatedAt,
  firstQuotedJobAt,
  firstTaskCompletedAt,
  t,
}: {
  onboardingCompleted: boolean;
  firstContactCreatedAt: Date | null;
  firstJobCreatedAt: Date | null;
  firstQuotedJobAt: Date | null;
  firstTaskCompletedAt: Date | null;
  t: Dictionary;
}) {
  const c = t.dashboard.checklist;

  const steps: Step[] = [
    { label: c.step1, done: onboardingCompleted, href: "/onboarding" },
    { label: c.step2, done: firstContactCreatedAt !== null, href: "/contacts/new" },
    { label: c.step3, done: firstJobCreatedAt !== null, href: "/jobs" },
    { label: c.step4, done: firstQuotedJobAt !== null, href: "/jobs" },
    { label: c.step5, done: firstTaskCompletedAt !== null, href: "/followups" },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const firstIncompleteIndex = steps.findIndex((s) => !s.done);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">
          {c.title}
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {c.doneCount
            .replace("{done}", String(doneCount))
            .replace("{total}", String(steps.length))}
        </span>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-2">
          {steps.map((step, i) => {
            if (step.done) {
              return (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-muted-foreground">{step.label}</span>
                </li>
              );
            }

            if (i === firstIncompleteIndex) {
              return (
                <li key={i}>
                  <Link
                    href={step.href}
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                    {step.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="h-4 w-4 shrink-0" />
                {step.label}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
