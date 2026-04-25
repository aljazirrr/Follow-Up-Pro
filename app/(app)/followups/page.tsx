import Link from "next/link";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FollowUpCard } from "@/components/followups/followup-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

type Filter = "today" | "overdue" | "upcoming" | "done" | "all";

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const t = getDictionary(getLocale());
  const f = t.followups;
  const TABS: { key: Filter; label: string }[] = [
    { key: "today", label: f.tabToday },
    { key: "overdue", label: f.tabOverdue },
    { key: "upcoming", label: f.tabUpcoming },
    { key: "done", label: f.tabCompleted },
    { key: "all", label: f.tabAll },
  ];
  const filterParam = (params.filter ?? "today") as Filter;
  const filter: Filter = TABS.some((tab) => tab.key === filterParam) ? filterParam : "today";
  const user = await requireUser();
  const now = new Date();

  const where: Prisma.FollowUpTaskWhereInput = { userId: user.id };
  switch (filter) {
    case "today":
      where.status = "PENDING";
      where.dueDate = { gte: startOfDay(now), lte: endOfDay(now) };
      break;
    case "overdue":
      where.status = "PENDING";
      where.dueDate = { lt: startOfDay(now) };
      break;
    case "upcoming":
      where.status = "PENDING";
      where.dueDate = { gt: endOfDay(now) };
      break;
    case "done":
      where.status = { in: ["DONE", "SENT", "SKIPPED"] };
      break;
    case "all":
    default:
      break;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { firstJobCreatedAt: true },
  });
  const firstJobCreatedAt = dbUser?.firstJobCreatedAt ?? null;

  const tasks = await prisma.followUpTask.findMany({
    where,
    include: {
      contact: { select: { id: true, fullName: true, email: true } },
      job: { select: { id: true, title: true } },
    },
    orderBy: { dueDate: filter === "done" ? "desc" : "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={f.title}
        description={f.desc}
      />

      <div className="flex flex-wrap gap-2 border-b">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/followups?filter=${t.key}`}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              filter === t.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          {tasks.length === 0 ? (
            filter === "all" ? (
              firstJobCreatedAt === null ? (
                <EmptyState
                  title={f.nothingTitle}
                  description={f.allNoJobsDesc}
                  action={
                    <Link href="/jobs" className={buttonVariants({ size: "sm" })}>
                      {f.goToJobs}
                    </Link>
                  }
                />
              ) : (
                <EmptyState
                  title={f.nothingTitle}
                  description={f.allDoneDesc}
                />
              )
            ) : (
              <EmptyState
                title={f.nothingTitle}
                description={
                  filter === "today"
                    ? f.todayEmpty
                    : filter === "overdue"
                      ? f.overdueEmpty
                      : filter === "upcoming"
                        ? f.upcomingEmpty
                        : f.allEmpty
                }
              />
            )
          ) : (
            tasks.map((t) => <FollowUpCard key={t.id} task={t} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
