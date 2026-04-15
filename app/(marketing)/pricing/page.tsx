import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Simple pricing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start free. Upgrade whenever you're ready.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-semibold">
              $0 <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Up to 20 contacts",
                "Up to 20 tasks / month",
                "1 custom template",
                "Auto-generated follow-ups",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Start free
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-semibold">
              $19 <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Unlimited contacts",
                "Unlimited tasks",
                "All templates editable",
                "Full email workflow",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className={buttonVariants({ size: "default" })}>
              Start free, upgrade later
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
