import { describe, it, expect } from "vitest";
import { INDUSTRY_DEFAULTS } from "@/lib/industry-defaults";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";

const EXPECTED_TYPES = ["QUOTE_FOLLOW_UP", "CONFIRMATION", "REVIEW_REQUEST", "REACTIVATION"];

describe("INDUSTRY_DEFAULTS", () => {
  const industries = Object.keys(INDUSTRY_DEFAULTS);

  it("defines all 5 industries", () => {
    expect(industries).toEqual(
      expect.arrayContaining(["INSTALLER", "DETAILER", "SALON", "REPAIR", "OTHER"])
    );
    expect(industries).toHaveLength(5);
  });

  for (const industry of Object.keys(INDUSTRY_DEFAULTS)) {
    describe(industry, () => {
      const config = INDUSTRY_DEFAULTS[industry];

      it("has positive quoteFollowUpDays", () => {
        expect(config.quoteFollowUpDays).toBeGreaterThan(0);
      });

      it("has positive reviewRequestDays", () => {
        expect(config.reviewRequestDays).toBeGreaterThan(0);
      });

      it("has exactly 4 templates (one per TaskType)", () => {
        expect(config.templates).toHaveLength(4);
        const types = config.templates.map((t) => t.type);
        expect(types.sort()).toEqual([...EXPECTED_TYPES].sort());
      });

      it("has non-empty subject and body for each template", () => {
        for (const tpl of config.templates) {
          expect(tpl.subject.length).toBeGreaterThan(0);
          expect(tpl.body.length).toBeGreaterThan(0);
          expect(tpl.name.length).toBeGreaterThan(0);
        }
      });
    });
  }

  it("OTHER uses the generic DEFAULT_TEMPLATES", () => {
    expect(INDUSTRY_DEFAULTS.OTHER.templates).toBe(DEFAULT_TEMPLATES);
  });

  it("non-OTHER industries have different templates from generic", () => {
    for (const industry of ["INSTALLER", "DETAILER", "SALON", "REPAIR"]) {
      const config = INDUSTRY_DEFAULTS[industry];
      const quoteTemplate = config.templates.find((t) => t.type === "QUOTE_FOLLOW_UP");
      const genericQuote = DEFAULT_TEMPLATES.find((t) => t.type === "QUOTE_FOLLOW_UP");
      expect(quoteTemplate?.subject).not.toBe(genericQuote?.subject);
    }
  });
});
