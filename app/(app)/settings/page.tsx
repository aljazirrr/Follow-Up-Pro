import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const s = t.settings;
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      name: true,
      ownerName: true,
      industry: true,
      quoteFollowUpDays: true,
      reviewRequestDays: true,
      createdAt: true,
    },
  });

  const industryLabel = dbUser?.industry
    ? t.onboarding.industries[dbUser.industry as keyof typeof t.onboarding.industries]?.label ?? dbUser.industry
    : "—";

  return (
    <div className="space-y-6">
      <PageHeader title={s.title} description={s.desc} />
      <Card>
        <CardHeader>
          <CardTitle>{s.account}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.email}
              </dt>
              <dd>{dbUser?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.ownerName}
              </dt>
              <dd>{dbUser?.ownerName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.businessType}
              </dt>
              <dd>{industryLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.memberSince}
              </dt>
              <dd>
                {dbUser?.createdAt
                  ? new Date(dbUser.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{s.automation}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.quoteFollowUpDays}
              </dt>
              <dd>
                {dbUser?.quoteFollowUpDays ?? 2} {dbUser?.quoteFollowUpDays === 1 ? s.day : s.days}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.reviewRequestDays}
              </dt>
              <dd>
                {dbUser?.reviewRequestDays ?? 1} {dbUser?.reviewRequestDays === 1 ? s.day : s.days}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            {s.automationNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
