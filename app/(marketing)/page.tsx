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

export default function LandingPage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const m = t.marketing;

  const problems = [m.p1, m.p2, m.p3, m.p4];
  const solutions = [m.s1, m.s2, m.s3, m.s4];
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

  return (
    <div>
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

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
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
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
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
        </div>
      </section>
    </div>
  );
}
