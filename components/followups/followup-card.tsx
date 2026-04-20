"use client";

import Link from "next/link";
import { toast } from "sonner";
import { CalendarClock, Check, SkipForward, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/shared/status-badge";
import { updateTaskStatus } from "@/actions/followups";
import { cn, formatDate, isOverdue, relativeFromNow } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/client";
import type { FollowUpTask, Contact, Job } from "@prisma/client";

type CardTask = FollowUpTask & {
  contact: Pick<Contact, "id" | "fullName" | "email">;
  job?: Pick<Job, "id" | "title"> | null;
};

export function FollowUpCard({ task }: { task: CardTask }) {
  const { t } = useTranslation();
  const f = t.followups;
  const overdue = isOverdue(task.status, task.dueDate);
  const dueLabel =
    task.status === "PENDING"
      ? `${f.due} ${formatDate(task.dueDate)} · ${relativeFromNow(task.dueDate)}`
      : `${formatDate(task.completedAt ?? task.dueDate)}`;

  async function mark(status: "DONE" | "SKIPPED") {
    const fd = new FormData();
    fd.set("taskId", task.id);
    fd.set("status", status);
    const res = await updateTaskStatus(fd);
    if (res.ok) toast.success(status === "DONE" ? f.markedDone : f.skipped);
    else toast.error(res.error);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
        overdue && "border-destructive/40"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} overdue={overdue} />
          <span className="text-sm font-medium">{task.title}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <Link href={`/contacts/${task.contact.id}`} className="hover:underline">
            {task.contact.fullName}
          </Link>
          {task.job ? <>{" · "}<span>{task.job.title}</span></> : null}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          {dueLabel}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {task.channel === "EMAIL" && task.status === "PENDING" ? (
          <Link href={`/followups/${task.id}`} className={buttonVariants({ size: "sm" })}>
            <Mail className="h-4 w-4" />
            {f.sendEmailBtn}
          </Link>
        ) : null}
        {task.status === "PENDING" ? (
          <>
            <Button size="sm" variant="outline" onClick={() => mark("DONE")}>
              <Check className="h-4 w-4" />
              {f.done}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => mark("SKIPPED")}>
              <SkipForward className="h-4 w-4" />
              {f.skip}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
