import { describe, expect, it } from "vitest";
import {
  createMonthlyBudgetSchema,
  updateMonthlyBudgetSchema,
} from "./monthlyBudget.schema";

describe("createMonthlyBudgetSchema", () => {
  it("accepts YYYY-MM and non-negative amount", () => {
    const result = createMonthlyBudgetSchema.safeParse({
      month: "2026-03",
      expenseAmount: "5000",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.expenseAmount).toBe(5000);
  });

  it("rejects invalid month or negative amount", () => {
    expect(
      createMonthlyBudgetSchema.safeParse({
        month: "2026-3",
        expenseAmount: 10,
      }).success,
    ).toBe(false);
    expect(
      createMonthlyBudgetSchema.safeParse({
        month: "2026-03",
        expenseAmount: -1,
      }).success,
    ).toBe(false);
  });
});

describe("updateMonthlyBudgetSchema", () => {
  it("requires at least one field", () => {
    expect(updateMonthlyBudgetSchema.safeParse({}).success).toBe(false);
    expect(
      updateMonthlyBudgetSchema.safeParse({ expenseAmount: 100 }).success,
    ).toBe(true);
    expect(
      updateMonthlyBudgetSchema.safeParse({ month: "2026-04" }).success,
    ).toBe(true);
  });
});
