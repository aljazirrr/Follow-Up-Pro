"use client";

import { useLocale, useSetLocale } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", className)}>
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "rounded px-1.5 py-0.5 transition-colors",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        onClick={() => setLocale("nl")}
        className={cn(
          "rounded px-1.5 py-0.5 transition-colors",
          locale === "nl"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        NL
      </button>
    </div>
  );
}
