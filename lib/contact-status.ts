import type { ContactStatus, JobStatus, TaskStatus } from "@prisma/client";

export const INACTIVE_DAYS = 90;

const OPEN_JOB_STATUSES: JobStatus[] = ["NEW", "QUOTED", "WON"];

type ContactForStatus = {
  status: ContactStatus;
  lastContactedAt: Date | null;
  createdAt: Date;
  jobs: { status: JobStatus }[];
  tasks: { status: TaskStatus }[];
};

/**
 * Returns true if a contact should be transitioned to INACTIVE.
 * Pure function — no side effects, safe to unit-test.
 *
 * Inactive means:
 *   - not already LOST or INACTIVE
 *   - no open job (NEW / QUOTED / WON)
 *   - no PENDING follow-up task
 *   - no meaningful activity in the last INACTIVE_DAYS days
 */
export function shouldMarkInactive(
  contact: ContactForStatus,
  now: Date = new Date()
): boolean {
  if (contact.status === "LOST" || contact.status === "INACTIVE") return false;

  const hasOpenJob = contact.jobs.some((j) =>
    OPEN_JOB_STATUSES.includes(j.status)
  );
  if (hasOpenJob) return false;

  const hasPendingTask = contact.tasks.some((t) => t.status === "PENDING");
  if (hasPendingTask) return false;

  const threshold = new Date(
    now.getTime() - INACTIVE_DAYS * 24 * 60 * 60 * 1000
  );
  const lastActivity = contact.lastContactedAt ?? contact.createdAt;
  return lastActivity < threshold;
}

/** Prisma `where` clause that matches contacts meeting inactive criteria. */
export function inactiveWhereClause(userId: string, now: Date = new Date()) {
  const threshold = new Date(
    now.getTime() - INACTIVE_DAYS * 24 * 60 * 60 * 1000
  );
  return {
    userId,
    status: { not: "LOST" as ContactStatus },
    jobs: { none: { status: { in: OPEN_JOB_STATUSES } } },
    tasks: { none: { status: "PENDING" as TaskStatus } },
    OR: [
      { lastContactedAt: { lt: threshold } },
      { lastContactedAt: null, createdAt: { lt: threshold } },
    ],
  };
}
