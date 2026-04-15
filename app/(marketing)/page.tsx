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

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 text-center md:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            Automated follow-ups for local service businesses
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Never miss a customer follow-up again.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Follow Up Pro helps local service businesses track leads, automate
            follow-ups, and request reviews — without a bloated CRM.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={buttonVariants({ size: "lg" })}
            >
              Start free
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Lost follow-ups = lost revenue
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "You send a quote and never hear back.",
                "The job's done but you forget to ask for a review.",
                "Your client list lives in WhatsApp, Excel, or your head.",
                "Generic CRMs are too heavy for a 1–10 person team.",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              A follow-up engine with a mini-CRM around it
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "See exactly who to contact today.",
                "Auto-generated tasks when a quote is sent, a job is won, or work is completed.",
                "Send branded emails from built-in templates.",
                "Stay simple. No drag-and-drop workflow builder.",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {p}
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
            Built for small service teams
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Simple contacts",
                desc: "Add leads and customers in seconds. No custom-field rabbit hole.",
              },
              {
                icon: ListChecks,
                title: "Auto follow-ups",
                desc: "Quote sent → task in 2 days. Job won → confirmation. Job done → ask for a review.",
              },
              {
                icon: Mail,
                title: "Email templates",
                desc: "Pre-written messages with {{customer_name}} placeholders you can edit.",
              },
              {
                icon: AlertTriangle,
                title: "Overdue alerts",
                desc: "The dashboard flags everything that slipped so nothing falls through.",
              },
              {
                icon: Star,
                title: "Review requests",
                desc: "Every completed job triggers a review request task automatically.",
              },
              {
                icon: Zap,
                title: "Fast UI",
                desc: "Designed for clarity and speed — not for training sessions.",
              },
            ].map((f) => {
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
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-3">
          {[
            { n: 1, t: "Add a contact", d: "Enter the basics — name, phone, email, service type." },
            { n: 2, t: "Create a job", d: "Track the opportunity and move it through statuses." },
            { n: 3, t: "Follow-ups show up", d: "The right tasks appear automatically in your dashboard." },
          ].map((s) => (
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
          <h2 className="text-2xl font-semibold tracking-tight">
            Stop losing leads to inbox amnesia.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start free. Upgrade when your team grows.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className={buttonVariants({ size: "lg" })}
            >
              Create your account
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
