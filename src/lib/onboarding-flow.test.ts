import { beforeEach, describe, expect, it } from "vitest";
import {
  hasMonthFinancialActivity,
  isOnboardingFlowDismissed,
  markOnboardingFlowDismissed,
} from "./onboarding-flow";

describe("hasMonthFinancialActivity", () => {
  it("returns false for null/empty summaries", () => {
    expect(hasMonthFinancialActivity(null)).toBe(false);
    expect(
      hasMonthFinancialActivity({ income: [], expense: [], savings: [] }),
    ).toBe(false);
  });

  it("returns true when any bucket has totals", () => {
    expect(
      hasMonthFinancialActivity({
        income: [{ category: "income", count: 1, total: 10 }],
        expense: [],
        savings: [],
      }),
    ).toBe(true);
  });
});

describe("onboarding dismiss storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("treats missing month as dismissed", () => {
    expect(isOnboardingFlowDismissed("user@x.com", null)).toBe(true);
  });

  it("persists and reads dismissal for a month", () => {
    expect(isOnboardingFlowDismissed("user@x.com", "2026-08")).toBe(false);
    markOnboardingFlowDismissed("user@x.com", "2026-08");
    expect(isOnboardingFlowDismissed("user@x.com", "2026-08")).toBe(true);
    // case-insensitive matching
    expect(isOnboardingFlowDismissed("USER@X.COM", "2026-08")).toBe(true);
    expect(isOnboardingFlowDismissed("other@x.com", "2026-08")).toBe(false);
    expect(isOnboardingFlowDismissed("user@x.com", "2026-09")).toBe(false);
  });

  it("handles null/undefined user safely", () => {
    expect(isOnboardingFlowDismissed(null, "2026-08")).toBe(true);
    markOnboardingFlowDismissed(null, "2026-08");
    expect(isOnboardingFlowDismissed("user@x.com", "2026-08")).toBe(false);
  });
});
