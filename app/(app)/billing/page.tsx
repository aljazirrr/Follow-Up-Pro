import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpgradeButton } from "./upgrade-button";
import { STRIPE_CONFIGURED } from "@/lib/stripe";
import { formatDate } from "@/lib/utils";

const FEATURES = {
  FREE: [
    "Up to 20 contacts",
    "Up to 20 tasks / month",
    "1 custom template",
    "Auto-generated follow-ups",
  ],
  PRO: [
    "Unlimited contacts",
    "Unlimited tasks",
    "All templates editable",
    "Full email workflow",
    "Priority support",
  ],
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const plan = sub?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Manage your Rebooker plan." />

      {sp.status === "success" ? (
        <div className="rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          Payment successful — your plan will update within a few seconds.
        </div>
      ) : null}
      {sp.status === "cancel" ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          Checkout cancelled.
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={plan === "FREE" ? "border-primary/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Free</CardTitle>
            {plan === "FREE" ? <Badge>Current plan</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">
              $0 <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {FEATURES.FREE.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={plan === "PRO" ? "border-primary/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Pro</CardTitle>
            {plan === "PRO" ? <Badge variant="success">Current plan</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">
              $19 <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {FEATURES.PRO.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            {plan === "FREE" ? (
              <UpgradeButton configured={STRIPE_CONFIGURED} />
            ) : (
              <div className="text-sm text-muted-foreground">
                Renews{" "}
                {sub?.currentPeriodEnd
                  ? formatDate(sub.currentPeriodEnd)
                  : "—"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
