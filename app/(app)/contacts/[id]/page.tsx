import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { JobForm } from "@/components/jobs/job-form";
import { JobStatusSelect } from "@/components/jobs/job-status-select";
import { FollowUpCard } from "@/components/followups/followup-card";
import { JobStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const c = t.contacts;

  const contact = await prisma.contact.findFirst({
    where: { id, userId: user.id },
    include: {
      jobs: { orderBy: { createdAt: "desc" } },
      tasks: {
        include: {
          contact: { select: { id: true, fullName: true, email: true } },
          job: { select: { id: true, title: true } },
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });
  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {c.allContacts}
        </Link>
      </div>

      <PageHeader
        title={contact.fullName}
        description={[contact.serviceType, contact.companyName].filter(Boolean).join(" · ") || "Contact"}
        actions={
          <Link
            href={`/contacts/${contact.id}/edit`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Pencil className="h-4 w-4" /> {c.edit}
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>{c.details}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.emailLabel}</dt>
                <dd>{contact.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.phoneLabel}</dt>
                <dd>{contact.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.companyLabel}</dt>
                <dd>{contact.companyName || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.sourceLabel}</dt>
                <dd>{t.source[contact.source]}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.notesLabel}</dt>
                <dd className="whitespace-pre-wrap text-foreground">{contact.notes || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.colCreated}</dt>
                <dd>{formatDate(contact.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{t.nav.jobs}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <JobForm contactId={contact.id} />
              {contact.jobs.length === 0 ? (
                <EmptyState
                  title={c.noJobsTitle}
                  description={c.noJobsDesc}
                />
              ) : (
                <ul className="divide-y rounded-lg border">
                  {contact.jobs.map((j) => (
                    <li
                      key={j.id}
                      className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-medium">{j.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(j.estimatedValue, j.currency)} ·{" "}
                          {formatDate(j.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <JobStatusBadge status={j.status} />
                        <JobStatusSelect jobId={j.id} status={j.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{c.timeline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.tasks.length === 0 ? (
                <EmptyState
                  title={c.noFollowUpsTitle}
                  description={c.noFollowUpsDesc}
                />
              ) : (
                contact.tasks.map((t) => <FollowUpCard key={t.id} task={t} />)
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
