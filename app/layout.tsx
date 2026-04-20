import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/dictionaries";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rebooker.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rebooker — Automated Follow-Ups for Service Businesses",
    template: "%s · Rebooker",
  },
  description:
    "Never miss a follow-up again. Rebooker helps plumbers, detailers, salons, and local service businesses track leads, send quote follow-ups, and request reviews automatically. Start free.",
  applicationName: "Rebooker",
  keywords: [
    "follow-up tool",
    "CRM for service businesses",
    "quote follow-up",
    "review request automation",
    "local business CRM",
    "installateur CRM",
    "detailer CRM",
    "salon software",
    "ZZP tool",
    "opvolgtool",
  ],
  authors: [{ name: "Rebooker" }],
  creator: "Rebooker",
  publisher: "Rebooker",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      nl: "/",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Rebooker",
    title: "Rebooker — Stop losing customers to forgotten follow-ups",
    description:
      "The automated follow-up tool for local service businesses. Track leads, follow up on quotes, and request reviews — free to start.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rebooker — Never miss a customer follow-up again",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebooker — Stop losing customers to forgotten follow-ups",
    description:
      "Automated follow-ups for local service businesses. Free to start.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
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
