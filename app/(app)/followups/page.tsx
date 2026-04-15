import Link from "next/link";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FollowUpCard } from "@/components/followups/followup-card";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

type Filter = "today" | "overdue" | "upcoming" | "done" | "all";

const TABS: { key: Filter; label: string }[] = [
  { key: "today", label: "Due today" },
  { key: "overdue", label: "Overdue" },
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Completed" },
  { key: "all", label: "All" },
];

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filterParam = (params.filter ?? "today") as Filter;
  const filter: Filter = TABS.some((t) => t.key === filterParam) ? filterParam : "today";
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

  const tasks = await prisma.followUpTask.findMany({
    where,
    include: {
      contact: { select: { id: true, fullName: true, email: true } },
      job: { select: { id: true, title: true } },
    },
    orderBy: { dueDate: filter === "done" ? "desc" : "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Your auto-generated and manual tasks."
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
            <EmptyState
              title="Nothing here"
              description={
                filter === "today"
                  ? "You're caught up for today."
                  : filter === "overdue"
                    ? "No overdue tasks."
                    : filter === "upcoming"
                      ? "No upcoming tasks."
                      : "No tasks match this view."
              }
            />
          ) : (
            tasks.map((t) => <FollowUpCard key={t.id} task={t} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
