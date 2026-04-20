"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

export function UpgradeBanner({ plan }: { plan: "FREE" | "PRO" }) {
  const { t } = useTranslation();
  if (plan === "PRO") return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-accent/40 px-4 py-2 text-sm md:px-6">
      <div className="flex items-center gap-2 text-accent-foreground">
        <Sparkles className="h-4 w-4" />
        {t.upgradeBanner.text}
      </div>
      <Link href="/billing" className="font-medium text-primary underline-offset-4 hover:underline">
        {t.upgradeBanner.link}
      </Link>
    </div>
  );
}
