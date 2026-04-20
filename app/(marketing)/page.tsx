import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  Mail,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getDictionary } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rebooker.io";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const t = getDictionary(locale);
  const m = t.marketing;
  const titleNL = "Rebooker — Automatische Opvolgingen voor Servicebedrijven";
  const titleEN = "Rebooker — Automated Follow-Ups for Service Businesses";
  const descNL =
    "Mis nooit meer een opvolging. Rebooker helpt installateurs, detailers, salons en lokale servicebedrijven met leads bijhouden, offertes opvolgen en automatisch reviews aanvragen. Gratis starten.";
  const descEN =
    "Never miss a follow-up again. Rebooker helps plumbers, detailers, salons, and local service businesses track leads, send quote follow-ups, and request reviews automatically. Start free.";
  return {
    title: locale === "nl" ? titleNL : titleEN,
    description: locale === "nl" ? descNL : descEN,
    openGraph: {
      title: m.hero,
      description: m.heroSub,
      url: SITE_URL,
    },
    twitter: {
      title: m.hero,
      description: m.heroSub,
    },
  };
}

export default function LandingPage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const m = t.marketing;

  const problems = [m.p1, m.p2, m.p3, m.p4];
  const solutions = [m.s1, m.s2, m.s3, m.s4];
  const benefits = [m.b1, m.b2, m.b3, m.b4, m.b5];
  const features = [
    { icon: Users, title: m.f1Title, desc: m.f1Desc },
    { icon: ListChecks, title: m.f2Title, desc: m.f2Desc },
    { icon: Mail, title: m.f3Title, desc: m.f3Desc },
    { icon: AlertTriangle, title: m.f4Title, desc: m.f4Desc },
    { icon: Star, title: m.f5Title, desc: m.f5Desc },
    { icon: Zap, title: m.f6Title, desc: m.f6Desc },
  ];
  const steps = [
    { n: 1, t: m.step1Title, d: m.step1Desc },
    { n: 2, t: m.step2Title, d: m.step2Desc },
    { n: 3, t: m.step3Title, d: m.step3Desc },
  ];
  const faqs = [
    { q: m.faq1Q, a: m.faq1A },
    { q: m.faq2Q, a: m.faq2A },
    { q: m.faq3Q, a: m.faq3A },
    { q: m.faq4Q, a: m.faq4A },
    { q: m.faq5Q, a: m.faq5A },
  ];

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rebooker",
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Automated follow-up tool for local service businesses. Track leads, send quote follow-ups, and request reviews.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "EUR",
        description: "Up to 20 contacts, 20 tasks/month, 1 custom template",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "19",
        priceCurrency: "EUR",
        description:
          "Unlimited contacts, unlimited tasks, all templates, full email workflow",
      },
    ],
    author: { "@type": "Organization", name: "Rebooker" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rebooker",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 text-center md:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            {m.badge}
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            {m.hero}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {m.heroSub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              {m.startFree}
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {m.viewPricing}
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{m.noCardNeeded}</p>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{m.problemTitle}</h2>
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
            <h2 className="text-2xl font-semibold tracking-tight">{m.solutionTitle}</h2>
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

      {/* Benefits */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            {m.benefitsTitle}
          </h2>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-sm">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-lg border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          {m.featuresTitle}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title}>
                <CardContent className="pt-6">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">{m.howTitle}</h2>
          <ol className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-lg border bg-card p-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">{m.faqTitle}</h2>
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
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{m.ctaTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{m.ctaSub}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              {m.createAccount}
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {m.seePricing}
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{m.noCardNeeded}</p>
        </div>
      </section>
    </div>
  );
}
