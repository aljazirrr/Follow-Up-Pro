import type { Prisma } from "@prisma/client";

const DAY = 86400000;
const DEFAULT_FOLLOW_UP_DAYS = 2;

function safeFollowUpDays(days: number): number {
  return Number.isFinite(days) && days > 0 ? days : DEFAULT_FOLLOW_UP_DAYS;
}

export function isStaleQuote(
  quoteSentAt: Date | null | undefined,
  quoteFollowUpDays: number,
  now: Date = new Date()
): boolean {
  if (!quoteSentAt) return false;
  const threshold = safeFollowUpDays(quoteFollowUpDays) * 2 * DAY;
  return now.getTime() - quoteSentAt.getTime() > threshold;
}

export function staleQuoteWhereClause(
  userId: string,
  quoteFollowUpDays: number,
  now: Date = new Date()
): Prisma.JobWhereInput {
  const threshold = safeFollowUpDays(quoteFollowUpDays) * 2 * DAY;
  const cutoff = new Date(now.getTime() - threshold);
  return {
    userId,
    status: "QUOTED",
    quoteSentAt: { lt: cutoff },
  };
}
