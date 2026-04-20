import Link from "next/link";
import { endOfDay, startOfDay } from "date-fns";
import {
  Users,
  FileText,
  Trophy,
  CheckCircle2,
  Star,
  ListChecks,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { KPIStatCard } from "@/components/dashboard/kpi-card";
import { FollowUpCard } from "@/components/followups/followup-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const d = t.dashboard;
  const now = new Date();

  const [counts, todayTasks, overdueTasks, recentContacts] = await Promise.all([
    // KPIs
    prisma.$transaction([
      prisma.contact.count({ where: { userId: user.id } }),
      prisma.job.count({ where: { userId: user.id, status: "QUOTED" } }),
      prisma.job.count({ where: { userId: user.id, status: "WON" } }),
      prisma.job.count({ where: { userId: user.id, status: "COMPLETED" } }),
      prisma.followUpTask.count({
        where: { userId: user.id, type: "REVIEW_REQUEST" },
      }),
    ]),
    prisma.followUpTask.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
        dueDate: { gte: startOfDay(now), lte: endOfDay(now) },
      },
      include: {
        contact: { select: { id: true, fullName: true, email: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
    prisma.followUpTask.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
        dueDate: { lt: startOfDay(now) },
      },
      include: {
        contact: { select: { id: true, fullName: true, email: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
    prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const [totalContacts, quoted, won, completed, reviewRequested] = counts;

  return (
    <div className="space-y-6">
      <PageHeader
        title={d.title}
        description={d.desc}
        actions={
          <>
            <Link
              href="/contacts/new"
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="h-4 w-4" /> {d.addLead}
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KPIStatCard label={d.totalLeads} value={totalContacts} icon={Users} />
        <KPIStatCard label={d.quoted} value={quoted} icon={FileText} tone="warning" />
        <KPIStatCard label={d.won} value={won} icon={Trophy} tone="success" />
        <KPIStatCard label={d.completed} value={completed} icon={CheckCircle2} tone="success" />
        <KPIStatCard label={d.reviewRequested} value={reviewRequested} icon={Star} />
      </div>

      {/* Today + overdue */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              {d.dueToday}
              <span className="text-xs font-normal text-muted-foreground">
                ({todayTasks.length})
              </span>
            </CardTitle>
            <Link
              href="/followups"
              className="text-xs text-primary hover:underline"
            >
              {d.viewAll}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.length === 0 ? (
              <EmptyState
                title={d.nothingDueTitle}
                description={d.nothingDueDesc}
              />
            ) : (
              todayTasks.map((t) => <FollowUpCard key={t.id} task={t} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {d.overdue}
              <span className="text-xs font-normal text-muted-foreground">
                ({overdueTasks.length})
              </span>
            </CardTitle>
            <Link
              href="/followups?filter=overdue"
              className="text-xs text-primary hover:underline"
            >
              {d.openAll}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks.length === 0 ? (
              <EmptyState
                title={d.noOverdueTitle}
                description={d.noOverdueDesc}
              />
            ) : (
              overdueTasks.map((t) => <FollowUpCard key={t.id} task={t} />)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{d.recentContacts}</CardTitle>
          <Link
            href="/contacts"
            className="text-xs text-primary hover:underline"
          >
            {d.viewAll}
          </Link>
        </CardHeader>
        <CardContent>
          {recentContacts.length === 0 ? (
            <EmptyState
              title={d.noContactsTitle}
              description={d.noContactsDesc}
              action={
                <Link
                  href="/contacts/new"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="h-4 w-4" />
                  {d.addContact}
                </Link>
              }
            />
          ) : (
            <ul className="divide-y">
              {recentContacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/contacts/${c.id}`}
                      className="font-medium hover:underline"
                    >
                      {c.fullName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {c.serviceType || "—"}
                      {c.email ? ` · ${c.email}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
