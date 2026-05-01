import type { Metadata } from "next";
import {
  AlertTriangle,
  Calendar,
  Car,
  CheckCircle2,
  Mail,
  RefreshCw,
  Star,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getDictionary } from "@/lib/i18n";
import { DetailersTracker } from "@/components/marketing/detailers-tracker";
import { DetailersCtaLink } from "@/components/marketing/detailers-cta";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rebooker.io";
const PAGE_URL = `${SITE_URL}/for/auto-detailers`;

export const metadata: Metadata = {
  title: "Rebooker for Auto Detailers | Follow-Ups, Reviews, and Repeat Jobs",
  description:
    "Rebooker helps auto detailing businesses track leads, quotes, jobs, and review reminders without a bloated CRM.",
  openGraph: {
    title: "Rebooker for Auto Detailers | Follow-Ups, Reviews, and Repeat Jobs",
    description:
      "Rebooker helps auto detailing businesses track leads, quotes, jobs, and review reminders without a bloated CRM.",
    url: PAGE_URL,
  },
  twitter: {
    title: "Rebooker for Auto Detailers | Follow-Ups, Reviews, and Repeat Jobs",
    description:
      "Rebooker helps auto detailing businesses track leads, quotes, jobs, and review reminders without a bloated CRM.",
  },
  alternates: { canonical: PAGE_URL },
};

export default function AutoDetailersPage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const m = t.marketing;
  const d = m.detailers;

  const problems = [d.p1, d.p2, d.p3, d.p4];
  const solutions = [d.s1, d.s2, d.s3, d.s4];
  const useCases = [
    { icon: Mail, title: d.uc1Title, desc: d.uc1Desc },
    { icon: Calendar, title: d.uc2Title, desc: d.uc2Desc },
    { icon: Star, title: d.uc3Title, desc: d.uc3Desc },
    { icon: RefreshCw, title: d.uc4Title, desc: d.uc4Desc },
  ];
  const steps = [
    { n: 1, title: d.step1Title, desc: d.step1Desc },
    { n: 2, title: d.step2Title, desc: d.step2Desc },
    { n: 3, title: d.step3Title, desc: d.step3Desc },
  ];
  const faqs = [
    { q: d.faq1Q, a: d.faq1A },
    { q: d.faq2Q, a: d.faq2A },
    { q: d.faq3Q, a: d.faq3A },
    { q: d.faq4Q, a: d.faq4A },
    { q: d.faq5Q, a: d.faq5A },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rebooker",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Follow-up automation for auto detailing businesses. Track quotes, confirm bookings, and request reviews automatically.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "EUR",
        description: "Up to 20 contacts, 20 tasks/month",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "19",
        priceCurrency: "EUR",
        description: "Unlimited contacts, unlimited tasks, all templates",
      },
    ],
    author: { "@type": "Organization", name: "Rebooker" },
  };

  return (
    <div>
      <DetailersTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 text-center md:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Car className="h-3 w-3" />
            {d.badge}
          </div>
          <div className="mx-auto mt-2 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {m.betaBadge}
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            {d.hero}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {d.heroSub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <DetailersCtaLink
              href="/register"
              cta="start_free"
              eventName="landing_detailers_cta_clicked"
              label={m.startFree}
            />
            <DetailersCtaLink
              href="/pricing"
              cta="view_pricing"
              eventName="landing_detailers_pricing_clicked"
              label={m.viewPricing}
              variant="outline"
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{m.noCardNeeded}</p>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{d.problemTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{d.solutionTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            {d.useCasesTitle}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <Card key={uc.title}>
                  <CardContent className="pt-6">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-semibold">{uc.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{uc.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">{d.howTitle}</h2>
        <ol className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-lg border bg-card p-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">{d.faqTitle}</h2>
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 font-medium">
                  <span>{f.q}</span>
                  <span className="mt-1 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">{d.ctaTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{d.ctaSub}</p>
          <div className="mt-6 flex justify-center gap-3">
            <DetailersCtaLink
              href="/register"
              cta="start_free"
              eventName="landing_detailers_cta_clicked"
              label={m.startFree}
            />
            <DetailersCtaLink
              href="/pricing"
              cta="view_pricing"
              eventName="landing_detailers_pricing_clicked"
              label={m.seePricing}
              variant="outline"
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{m.noCardNeeded}</p>
        </div>
      </section>
    </div>
  );
}
