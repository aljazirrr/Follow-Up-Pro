import { describe, it, expect } from "vitest";
import { isStaleQuote, staleQuoteWhereClause } from "@/lib/stale-quotes";

const DAY = 86400000;

describe("isStaleQuote", () => {
  const now = new Date("2026-04-24T12:00:00Z");

  it("returns false when quoteSentAt is null", () => {
    expect(isStaleQuote(null, 2, now)).toBe(false);
  });

  it("returns false when quoteSentAt is undefined", () => {
    expect(isStaleQuote(undefined, 2, now)).toBe(false);
  });

  it("returns false when quote was sent today", () => {
    expect(isStaleQuote(now, 2, now)).toBe(false);
  });

  it("returns false at exactly the threshold (strict greater-than)", () => {
    const sentAt = new Date(now.getTime() - 2 * 2 * DAY);
    expect(isStaleQuote(sentAt, 2, now)).toBe(false);
  });

  it("returns true 1ms past the threshold", () => {
    const sentAt = new Date(now.getTime() - 2 * 2 * DAY - 1);
    expect(isStaleQuote(sentAt, 2, now)).toBe(true);
  });

  it("returns true when well past threshold", () => {
    const sentAt = new Date(now.getTime() - 10 * DAY);
    expect(isStaleQuote(sentAt, 2, now)).toBe(true);
  });

  it("respects custom quoteFollowUpDays", () => {
    const sentAt = new Date(now.getTime() - 5 * DAY);
    expect(isStaleQuote(sentAt, 3, now)).toBe(false);
    const sentAt2 = new Date(now.getTime() - 7 * DAY);
    expect(isStaleQuote(sentAt2, 3, now)).toBe(true);
  });

  it("uses fallback of 2 when quoteFollowUpDays is 0", () => {
    const sentAt = new Date(now.getTime() - 5 * DAY);
    expect(isStaleQuote(sentAt, 0, now)).toBe(true);
  });

  it("uses fallback of 2 when quoteFollowUpDays is negative", () => {
    const sentAt = new Date(now.getTime() - 5 * DAY);
    expect(isStaleQuote(sentAt, -1, now)).toBe(true);
  });

  it("uses fallback of 2 when quoteFollowUpDays is NaN", () => {
    const sentAt = new Date(now.getTime() - 5 * DAY);
    expect(isStaleQuote(sentAt, NaN, now)).toBe(true);
  });

  it("uses fallback of 2 when quoteFollowUpDays is Infinity", () => {
    const sentAt = new Date(now.getTime() - 5 * DAY);
    expect(isStaleQuote(sentAt, Infinity, now)).toBe(true);
  });
});

describe("staleQuoteWhereClause", () => {
  const now = new Date("2026-04-24T12:00:00Z");

  it("returns a where clause filtering QUOTED jobs before cutoff", () => {
    const clause = staleQuoteWhereClause("user_1", 2, now);
    expect(clause.userId).toBe("user_1");
    expect(clause.status).toBe("QUOTED");
    const cutoff = new Date(now.getTime() - 2 * 2 * DAY);
    expect(clause.quoteSentAt).toEqual({ lt: cutoff });
  });

  it("uses fallback for invalid quoteFollowUpDays", () => {
    const clause = staleQuoteWhereClause("user_1", 0, now);
    const cutoff = new Date(now.getTime() - 2 * 2 * DAY);
    expect(clause.quoteSentAt).toEqual({ lt: cutoff });
  });

  it("adjusts cutoff based on quoteFollowUpDays", () => {
    const clause = staleQuoteWhereClause("user_1", 5, now);
    const cutoff = new Date(now.getTime() - 5 * 2 * DAY);
    expect(clause.quoteSentAt).toEqual({ lt: cutoff });
  });
});
