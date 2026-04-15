import { Badge } from "@/components/ui/badge";
import type { JobStatus, TaskStatus } from "@prisma/client";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "muted" }> = {
    NEW: { label: "New", variant: "secondary" },
    QUOTED: { label: "Quoted", variant: "warning" },
    WON: { label: "Won", variant: "success" },
    COMPLETED: { label: "Completed", variant: "success" },
    REVIEW_REQUESTED: { label: "Review requested", variant: "default" },
    LOST: { label: "Lost", variant: "destructive" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function TaskStatusBadge({
  status,
  overdue,
}: {
  status: TaskStatus;
  overdue?: boolean;
}) {
  if (overdue && status === "PENDING") {
    return <Badge variant="destructive">Overdue</Badge>;
  }
  const map: Record<TaskStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "muted" }> = {
    PENDING: { label: "Pending", variant: "secondary" },
    SENT: { label: "Sent", variant: "success" },
    DONE: { label: "Done", variant: "success" },
    SKIPPED: { label: "Skipped", variant: "muted" },
    OVERDUE: { label: "Overdue", variant: "destructive" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
