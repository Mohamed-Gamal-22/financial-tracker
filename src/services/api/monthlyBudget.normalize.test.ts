import { describe, expect, it } from "vitest";
import { normalizeMonthlyBudget } from "./monthlyBudget";

describe("normalizeMonthlyBudget", () => {
  it("normalizes a valid budget row", () => {
    expect(
      normalizeMonthlyBudget({
        _id: "b1",
        month: "2026-03",
        expenseAmount: "1000",
        actualExpenses: 200,
      }),
    ).toEqual({
      _id: "b1",
      month: "2026-03",
      expenseAmount: 1000,
      savingsAmount: 0,
      actualExpenses: 200,
      actualSavings: 0,
      remainingExpenseBudget: 0,
      remainingSavings: 0,
    });
  });

  it("returns null when id or month is missing/invalid", () => {
    expect(normalizeMonthlyBudget({ month: "2026-03" })).toBeNull();
    expect(normalizeMonthlyBudget({ _id: "b1", month: "bad" })).toBeNull();
    expect(normalizeMonthlyBudget(null)).toBeNull();
  });
});
