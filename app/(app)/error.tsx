"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  const e = t.errors;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{e.appErrorTitle}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{e.appErrorBody}</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>{e.tryAgain}</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          {e.goToDashboard}
        </Link>
      </div>
    </div>
  );
}
