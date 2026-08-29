import { describe, expect, it } from "vitest";
import {
  createTransactionSchema,
  createTransactionUiSchema,
  reportQuerySchema,
  updateTransactionSchema,
} from "./transaction.schema";

describe("createTransactionSchema", () => {
  it("accepts a valid transaction", () => {
    const result = createTransactionSchema.safeParse({
      title: "راتب",
      amount: "1500",
      category: "income",
      date: "2026-03-01",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.amount).toBe(1500);
  });

  it("rejects zero or negative amounts", () => {
    expect(
      createTransactionSchema.safeParse({
        title: "x",
        amount: 0,
        category: "expense",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid ISO dates", () => {
    expect(
      createTransactionSchema.safeParse({
        title: "x",
        amount: 10,
        category: "expense",
        date: "01-03-2026",
      }).success,
    ).toBe(false);
  });
});

describe("createTransactionUiSchema", () => {
  it("requires categoryType instead of category", () => {
    expect(
      createTransactionUiSchema.safeParse({
        title: "قهوة",
        amount: 20,
        categoryType: "expense",
      }).success,
    ).toBe(true);
    expect(
      createTransactionUiSchema.safeParse({
        title: "قهوة",
        amount: 20,
        categoryType: "food",
      }).success,
    ).toBe(false);
  });
});

describe("updateTransactionSchema", () => {
  it("allows partial updates", () => {
    expect(updateTransactionSchema.safeParse({ title: "جديد" }).success).toBe(
      true,
    );
    expect(updateTransactionSchema.safeParse({}).success).toBe(true);
  });
});

describe("reportQuerySchema", () => {
  it("accepts current mode without date/month", () => {
    expect(reportQuerySchema.safeParse({ mode: "current" }).success).toBe(true);
  });

  it("requires YYYY-MM-DD for day mode", () => {
    expect(
      reportQuerySchema.safeParse({ mode: "day", date: "2026-03-15" }).success,
    ).toBe(true);
    expect(reportQuerySchema.safeParse({ mode: "day" }).success).toBe(false);
  });

  it("requires YYYY-MM for month mode", () => {
    expect(
      reportQuerySchema.safeParse({ mode: "month", month: "2026-03" }).success,
    ).toBe(true);
    expect(reportQuerySchema.safeParse({ mode: "month" }).success).toBe(false);
  });
});
