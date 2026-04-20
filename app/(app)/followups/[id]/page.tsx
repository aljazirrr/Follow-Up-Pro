import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailComposer } from "@/components/followups/email-composer";
import { renderTemplate } from "@/lib/templates";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";

export default async function FollowUpDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const t = getDictionary(getLocale()).followups;

  const task = await prisma.followUpTask.findFirst({
    where: { id, userId: user.id },
    include: {
      contact: true,
      job: true,
    },
  });
  if (!task) notFound();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { ownerName: true, name: true },
  });

  // Find the template for this task type — fall back to the default template bundled in the app.
  const template =
    (await prisma.messageTemplate.findUnique({
      where: { userId_type: { userId: user.id, type: task.type } },
    })) ??
    DEFAULT_TEMPLATES.find((t) => t.type === task.type) ??
    null;

  const ctx = {
    customer_name: task.contact.fullName,
    service_type: task.contact.serviceType ?? undefined,
    job_title: task.job?.title ?? task.title,
    company_name: task.contact.companyName ?? undefined,
    owner_name: dbUser?.ownerName ?? dbUser?.name ?? "",
  };

  const initialSubject = template ? renderTemplate(template.subject, ctx) : task.title;
  const initialBody = template ? renderTemplate(template.body, ctx) : "";

  return (
    <div className="space-y-6">
      <Link
        href="/followups"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t.allFollowUps}
      </Link>

      <PageHeader
        title={task.title}
        description={`For ${task.contact.fullName}${task.job ? ` · ${task.job.title}` : ""}`}
      />

      {task.channel === "EMAIL" ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.composeEmail}</CardTitle>
          </CardHeader>
          <CardContent>
            {task.contact.email ? (
              <EmailComposer
                taskId={task.id}
                to={task.contact.email}
                subject={initialSubject}
                body={initialBody}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {t.noEmail}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {t.manualTask}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
