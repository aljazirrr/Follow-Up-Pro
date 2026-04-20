import { cookies } from "next/headers";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

export type { Locale, Dictionary };
export { dictionaries };

export function getLocale(): Locale {
  const cookieStore = cookies();
  const value = cookieStore.get("locale")?.value;
  return value === "nl" ? "nl" : "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
