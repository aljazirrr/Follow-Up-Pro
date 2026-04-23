import { describe, it, expect } from "vitest";
import { shouldMarkInactive, INACTIVE_DAYS } from "@/lib/contact-status";

const NOW = new Date("2025-06-01T12:00:00Z");
const DAYS = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

function makeContact(overrides: Partial<Parameters<typeof shouldMarkInactive>[0]> = {}) {
  return {
    status: "LEAD" as const,
    lastContactedAt: null,
    createdAt: DAYS(INACTIVE_DAYS + 1),
    jobs: [] as { status: "NEW" | "QUOTED" | "WON" | "COMPLETED" | "REVIEW_REQUESTED" | "LOST" }[],
    tasks: [] as { status: "PENDING" | "SENT" | "DONE" | "SKIPPED" | "OVERDUE" }[],
    ...overrides,
  };
}

describe("shouldMarkInactive", () => {
  it("returns true when contact is old with no activity", () => {
    expect(shouldMarkInactive(makeContact(), NOW)).toBe(true);
  });

  it("returns false when contact has recent lastContactedAt", () => {
    const contact = makeContact({ lastContactedAt: DAYS(10) });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns false when contact was created recently (no lastContactedAt)", () => {
    const contact = makeContact({ createdAt: DAYS(30), lastContactedAt: null });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns false when contact has an open job (NEW)", () => {
    const contact = makeContact({ jobs: [{ status: "NEW" }] });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns false when contact has an open job (QUOTED)", () => {
    const contact = makeContact({ jobs: [{ status: "QUOTED" }] });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns false when contact has an open job (WON)", () => {
    const contact = makeContact({ jobs: [{ status: "WON" }] });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns true when all jobs are closed (COMPLETED/LOST)", () => {
    const contact = makeContact({
      jobs: [{ status: "COMPLETED" }, { status: "LOST" }],
    });
    expect(shouldMarkInactive(contact, NOW)).toBe(true);
  });

  it("returns false when contact has a PENDING task", () => {
    const contact = makeContact({ tasks: [{ status: "PENDING" }] });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns true when tasks exist but none are PENDING", () => {
    const contact = makeContact({
      tasks: [{ status: "DONE" }, { status: "SKIPPED" }],
    });
    expect(shouldMarkInactive(contact, NOW)).toBe(true);
  });

  it("returns false when status is LOST", () => {
    const contact = makeContact({ status: "LOST" });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns false when status is already INACTIVE", () => {
    const contact = makeContact({ status: "INACTIVE" });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });

  it("returns true at exactly INACTIVE_DAYS + 1 day", () => {
    const contact = makeContact({ createdAt: DAYS(INACTIVE_DAYS + 1) });
    expect(shouldMarkInactive(contact, NOW)).toBe(true);
  });

  it("returns false at exactly INACTIVE_DAYS - 1 day", () => {
    const contact = makeContact({ createdAt: DAYS(INACTIVE_DAYS - 1) });
    expect(shouldMarkInactive(contact, NOW)).toBe(false);
  });
});
