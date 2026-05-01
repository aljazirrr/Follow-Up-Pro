import { describe, it, expect } from "vitest";
import { deriveContactStatusFromJobs } from "@/lib/automation";
import type { JobStatus } from "@prisma/client";

function derive(...statuses: JobStatus[]) {
  return deriveContactStatusFromJobs(statuses);
}

describe("deriveContactStatusFromJobs", () => {
  // Empty fallback
  it("returns LEAD when no jobs", () => {
    expect(derive()).toBe("LEAD");
  });

  // Single-status cases
  it("returns WON for a single WON job", () => {
    expect(derive("WON")).toBe("WON");
  });

  it("returns ACTIVE for a single NEW job", () => {
    expect(derive("NEW")).toBe("ACTIVE");
  });

  it("returns ACTIVE for a single QUOTED job", () => {
    expect(derive("QUOTED")).toBe("ACTIVE");
  });

  it("returns COMPLETED for a single COMPLETED job", () => {
    expect(derive("COMPLETED")).toBe("COMPLETED");
  });

  it("returns COMPLETED for a single REVIEW_REQUESTED job", () => {
    expect(derive("REVIEW_REQUESTED")).toBe("COMPLETED");
  });

  it("returns LOST for a single LOST job", () => {
    expect(derive("LOST")).toBe("LOST");
  });

  // Multi-job priority: WON beats everything
  it("WON beats LOST", () => {
    expect(derive("WON", "LOST")).toBe("WON");
  });

  it("WON beats COMPLETED", () => {
    expect(derive("WON", "COMPLETED")).toBe("WON");
  });

  it("WON beats ACTIVE (NEW)", () => {
    expect(derive("WON", "NEW")).toBe("WON");
  });

  it("WON beats REVIEW_REQUESTED", () => {
    expect(derive("WON", "REVIEW_REQUESTED")).toBe("WON");
  });

  // ACTIVE beats LOST and COMPLETED
  it("ACTIVE (QUOTED) beats LOST", () => {
    expect(derive("QUOTED", "LOST")).toBe("ACTIVE");
  });

  it("ACTIVE (NEW) beats LOST", () => {
    expect(derive("NEW", "LOST")).toBe("ACTIVE");
  });

  it("ACTIVE beats COMPLETED", () => {
    expect(derive("NEW", "COMPLETED")).toBe("ACTIVE");
  });

  // COMPLETED beats LOST
  it("COMPLETED beats LOST", () => {
    expect(derive("COMPLETED", "LOST")).toBe("COMPLETED");
  });

  it("REVIEW_REQUESTED + LOST => COMPLETED", () => {
    expect(derive("REVIEW_REQUESTED", "LOST")).toBe("COMPLETED");
  });

  // All LOST
  it("returns LOST when all jobs are LOST", () => {
    expect(derive("LOST", "LOST", "LOST")).toBe("LOST");
  });

  // Regression: Sprint 6 bulk-close scenario
  it("WON job stays WON when a QUOTED sibling becomes LOST", () => {
    // Before: contact has WON + QUOTED. User marks QUOTED as LOST.
    // Remaining jobs: WON + LOST. Should be WON.
    expect(derive("WON", "LOST")).toBe("WON");
  });

  it("COMPLETED contact with a stale QUOTED marked LOST stays COMPLETED", () => {
    expect(derive("COMPLETED", "LOST")).toBe("COMPLETED");
  });

  // Never returns INACTIVE or LEAD (except empty)
  it("never returns INACTIVE for any combination of job statuses", () => {
    const allStatuses: JobStatus[] = ["NEW", "QUOTED", "WON", "COMPLETED", "REVIEW_REQUESTED", "LOST"];
    for (const s of allStatuses) {
      expect(derive(s)).not.toBe("INACTIVE");
    }
    expect(derive("LOST", "COMPLETED", "WON", "NEW")).not.toBe("INACTIVE");
  });

  it("never returns LEAD when at least one job exists", () => {
    const allStatuses: JobStatus[] = ["NEW", "QUOTED", "WON", "COMPLETED", "REVIEW_REQUESTED", "LOST"];
    for (const s of allStatuses) {
      expect(derive(s)).not.toBe("LEAD");
    }
  });
});
