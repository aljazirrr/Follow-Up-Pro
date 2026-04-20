import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/dictionaries";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rebooker",
  description:
    "Automated follow-ups for local service businesses. Track leads, automate follow-ups, and request reviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (cookies().get("locale")?.value as Locale | undefined) ?? "en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LanguageProvider locale={locale}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
