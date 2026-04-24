import Link from "next/link";
import { endOfDay, startOfDay } from "date-fns";
import {
  Users,
  FileText,
  Trophy,
  CheckCircle2,
  Star,
  AlertTriangle,
  Plus,
  UserX,
  CalendarClock,
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
import { inactiveWhereClause } from "@/lib/contact-status";

export default async function DashboardPage() {
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const d = t.dashboard;
  const now = new Date();

  const [counts, attentionTasks, upcomingTasks] = await Promise.all([
    prisma.$transaction([
      prisma.contact.count({ where: { userId: user.id } }),
      prisma.job.count({ where: { userId: user.id, status: "QUOTED" } }),
      prisma.job.count({ where: { userId: user.id, status: "WON" } }),
      prisma.job.count({ where: { userId: user.id, status: "COMPLETED" } }),
      prisma.followUpTask.count({
        where: { userId: user.id, type: "REVIEW_REQUEST" },
      }),
      prisma.contact.count({ where: inactiveWhereClause(user.id, now) }),
    ]),
    // Overdue + today combined: overdue first (oldest), then today (earliest)
    prisma.followUpTask.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
        dueDate: { lte: endOfDay(now) },
      },
      include: {
        contact: { select: { id: true, fullName: true, email: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 20,
    }),
    // Next pending tasks after today
    prisma.followUpTask.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
        dueDate: { gt: endOfDay(now) },
      },
      include: {
        contact: { select: { id: true, fullName: true, email: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);

  const [totalContacts, quoted, won, completed, reviewRequested, inactiveCount] = counts;
  const overdueCount = attentionTasks.filter(
    (t) => t.dueDate < startOfDay(now)
  ).length;

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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <KPIStatCard label={d.totalLeads} value={totalContacts} icon={Users} />
        <KPIStatCard label={d.quoted} value={quoted} icon={FileText} tone="warning" />
        <KPIStatCard label={d.won} value={won} icon={Trophy} tone="success" />
        <KPIStatCard label={d.completed} value={completed} icon={CheckCircle2} tone="success" />
        <KPIStatCard label={d.reviewRequested} value={reviewRequested} icon={Star} />
        <KPIStatCard label={d.inactive} value={inactiveCount} icon={UserX} tone="destructive" href="/contacts?status=INACTIVE" />
      </div>

      {/* Needs attention: overdue + today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            {d.needsAttention}
            <span className="text-xs font-normal text-muted-foreground">
              ({attentionTasks.length}{overdueCount > 0 ? ` · ${overdueCount} ${d.overdue.toLowerCase()}` : ""})
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
          {attentionTasks.length === 0 ? (
            <EmptyState
              title={d.nothingNeedsAttentionTitle}
              description={d.nothingNeedsAttentionDesc}
            />
          ) : (
            attentionTasks.map((t) => <FollowUpCard key={t.id} task={t} />)
          )}
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            {d.upcoming}
            <span className="text-xs font-normal text-muted-foreground">
              ({upcomingTasks.length})
            </span>
          </CardTitle>
          <Link
            href="/followups?filter=upcoming"
            className="text-xs text-primary hover:underline"
          >
            {d.viewAll}
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingTasks.length === 0 ? (
            <EmptyState
              title={d.upcomingEmptyTitle}
              description={d.upcomingEmptyDesc}
            />
          ) : (
            upcomingTasks.map((t) => <FollowUpCard key={t.id} task={t} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
