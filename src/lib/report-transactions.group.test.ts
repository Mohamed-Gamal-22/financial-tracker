import { describe, expect, it } from "vitest";
import { groupTransactionsByType } from "./report-transactions";
import type { Transaction } from "@/schemas/transaction.schema";

const tx = (
  id: string,
  category: Transaction["category"],
): Transaction => ({
  _id: id,
  title: id,
  amount: 1,
  date: "2026-03-01",
  category,
});

describe("groupTransactionsByType", () => {
  it("buckets known types and drops unknown categories", () => {
    const grouped = groupTransactionsByType([
      tx("1", "income"),
      tx("2", "expense"),
      tx("3", "savings"),
      tx("4", "mystery"),
    ]);
    expect(grouped.income).toHaveLength(1);
    expect(grouped.expense).toHaveLength(1);
    expect(grouped.savings).toHaveLength(1);
  });
});
