"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

const LocaleContext = createContext<Locale>("en");

export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslation(): { t: Dictionary; locale: Locale } {
  const locale = useContext(LocaleContext);
  return { t: dictionaries[locale], locale };
}

export function useSetLocale() {
  const router = useRouter();
  return useCallback(
    async (locale: Locale) => {
      await fetch("/api/set-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      router.refresh();
    },
    [router]
  );
}
