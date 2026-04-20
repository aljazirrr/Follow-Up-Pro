import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();
  const t = getDictionary(getLocale()).settings;
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      name: true,
      ownerName: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} description={t.desc} />
      <Card>
        <CardHeader>
          <CardTitle>{t.account}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.email}
              </dt>
              <dd>{dbUser?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.ownerName}
              </dt>
              <dd>{dbUser?.ownerName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {t.memberSince}
              </dt>
              <dd>
                {dbUser?.createdAt
                  ? new Date(dbUser.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            {t.editNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
