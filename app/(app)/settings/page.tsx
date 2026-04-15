import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();
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
      <PageHeader title="Settings" description="Your account details." />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd>{dbUser?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Owner name
              </dt>
              <dd>{dbUser?.ownerName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Member since
              </dt>
              <dd>
                {dbUser?.createdAt
                  ? new Date(dbUser.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Account editing coming soon. For now, data is managed in the database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
