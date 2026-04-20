import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpgradeButton } from "./upgrade-button";
import { STRIPE_CONFIGURED } from "@/lib/stripe";
import { formatDate } from "@/lib/utils";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  const t = getDictionary(getLocale()).billing;
  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const plan = sub?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} description={t.desc} />

      {sp.status === "success" ? (
        <div className="rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          {t.paymentSuccess}
        </div>
      ) : null}
      {sp.status === "cancel" ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          {t.checkoutCancelled}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={plan === "FREE" ? "border-primary/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>{t.free}</CardTitle>
            {plan === "FREE" ? <Badge>{t.currentPlan}</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">
              $0 <span className="text-sm font-normal text-muted-foreground">{t.perMonth}</span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {t.freeFeatures.map((f) => (
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
            <CardTitle>{t.pro}</CardTitle>
            {plan === "PRO" ? <Badge variant="success">{t.currentPlan}</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">
              $19 <span className="text-sm font-normal text-muted-foreground">{t.perMonth}</span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {t.proFeatures.map((f) => (
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
                {t.renews}{" "}
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
