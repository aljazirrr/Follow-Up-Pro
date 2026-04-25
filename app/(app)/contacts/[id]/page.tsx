import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { JobForm } from "@/components/jobs/job-form";
import { JobStatusSelect } from "@/components/jobs/job-status-select";
import { FollowUpCard } from "@/components/followups/followup-card";
import { TimelineEvent, type JobEventType } from "@/components/shared/timeline-event";
import { ContactStatusBadge, JobStatusBadge } from "@/components/shared/status-badge";
import { ReactivateButton } from "@/components/contacts/reactivate-button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { shouldMarkInactive } from "@/lib/contact-status";
import type { ContactStatus, Job } from "@prisma/client";

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

  // Lazy INACTIVE evaluation: update DB if criteria met
  let currentStatus: ContactStatus = contact.status;
  if (shouldMarkInactive(contact)) {
    await prisma.contact.update({
      where: { id: contact.id },
      data: { status: "INACTIVE" },
    });
    currentStatus = "INACTIVE";
  }

  const showReactivate = currentStatus === "INACTIVE" || currentStatus === "LOST";

  // Build merged timeline: job lifecycle events + follow-up tasks, sorted by date desc.
  // Job events sort before task entries when timestamps are equal.
  type JobEntry = { kind: "job-event"; id: string; type: JobEventType; jobTitle: string; date: Date; label: string };
  type TaskEntry = { kind: "task"; id: string; task: (NonNullable<typeof contact>)["tasks"][number] };
  type TimelineEntry = JobEntry | TaskEntry;

  const jobEventDefs: Array<{ key: JobEventType; getDate: (j: Job) => Date | null }> = [
    { key: "created",   getDate: (j) => j.createdAt },
    { key: "quoted",    getDate: (j) => j.quoteSentAt },
    { key: "won",       getDate: (j) => j.wonAt },
    { key: "completed", getDate: (j) => j.completedAt },
    { key: "lost",      getDate: (j) => j.lostAt },
  ];

  const timelineEntries: TimelineEntry[] = [];

  for (const job of contact.jobs) {
    for (const def of jobEventDefs) {
      const date = def.getDate(job);
      if (date) {
        timelineEntries.push({
          kind: "job-event",
          id: `${job.id}-${def.key}`,
          type: def.key,
          jobTitle: job.title,
          date,
          label: c.jobEvents[def.key],
        });
      }
    }
  }

  for (const task of contact.tasks) {
    timelineEntries.push({ kind: "task", id: task.id, task });
  }

  timelineEntries.sort((a, b) => {
    const aTime = a.kind === "job-event" ? a.date.getTime() : a.task.dueDate.getTime();
    const bTime = b.kind === "job-event" ? b.date.getTime() : b.task.dueDate.getTime();
    if (bTime !== aTime) return bTime - aTime;
    return a.kind === "job-event" ? -1 : 1;
  });

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
          <div className="flex items-center gap-2">
            {showReactivate && <ReactivateButton contactId={contact.id} />}
            <Link
              href={`/contacts/${contact.id}/edit`}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <Pencil className="h-4 w-4" /> {c.edit}
            </Link>
          </div>
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
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.colStatus}</dt>
                <dd><ContactStatusBadge status={currentStatus} /></dd>
              </div>
              {contact.lastContactedAt && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.lastContacted}</dt>
                  <dd>{formatDate(contact.lastContactedAt)}</dd>
                </div>
              )}
              {contact.nextActionAt && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{c.nextAction}</dt>
                  <dd>{formatDate(contact.nextActionAt)}</dd>
                </div>
              )}
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
              {timelineEntries.length === 0 ? (
                <EmptyState
                  title={c.noFollowUpsTitle}
                  description={c.noFollowUpsDesc}
                />
              ) : (
                timelineEntries.map((entry) =>
                  entry.kind === "job-event" ? (
                    <TimelineEvent
                      key={entry.id}
                      type={entry.type}
                      jobTitle={entry.jobTitle}
                      date={entry.date}
                      label={entry.label}
                    />
                  ) : (
                    <FollowUpCard key={entry.id} task={entry.task} />
                  )
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
