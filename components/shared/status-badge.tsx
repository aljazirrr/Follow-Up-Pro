"use client";

import { Badge } from "@/components/ui/badge";
import type { ContactStatus, JobStatus, TaskStatus } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/client";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const { t } = useTranslation();
  const variants: Record<JobStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
    NEW: "secondary",
    QUOTED: "warning",
    WON: "success",
    COMPLETED: "success",
    REVIEW_REQUESTED: "default",
    LOST: "destructive",
  };
  return <Badge variant={variants[status]}>{t.status.job[status]}</Badge>;
}

export function TaskStatusBadge({ status, overdue }: { status: TaskStatus; overdue?: boolean }) {
  const { t } = useTranslation();
  if (overdue && status === "PENDING") {
    return <Badge variant="destructive">{t.status.task.OVERDUE}</Badge>;
  }
  const variants: Record<TaskStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
    PENDING: "secondary",
    SENT: "success",
    DONE: "success",
    SKIPPED: "muted",
    OVERDUE: "destructive",
  };
  return <Badge variant={variants[status]}>{t.status.task[status]}</Badge>;
}

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  const { t } = useTranslation();
  const variants: Record<ContactStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
    LEAD: "secondary",
    ACTIVE: "warning",
    WON: "success",
    COMPLETED: "success",
    INACTIVE: "muted",
    LOST: "destructive",
  };
  return <Badge variant={variants[status]}>{t.contactStatus[status]}</Badge>;
}
