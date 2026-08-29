import { describe, expect, it } from "vitest";
import { normalizeTransactionList } from "./transaction";
import type { Transaction } from "@/schemas/transaction.schema";

const tx = (id: string): Transaction => ({
  _id: id,
  title: id,
  amount: 1,
  date: "2026-03-01",
  category: "expense",
});

describe("normalizeTransactionList", () => {
  it("normalizes a plain array with envelope total", () => {
    const result = normalizeTransactionList(
      [tx("1"), tx("2")],
      { page: 1, limit: 10 },
      { total: 25 },
    );
    expect(result.total).toBe(25);
    expect(result.hasMore).toBe(true);
    expect(result.totalReliable).toBe(true);
    expect(result.transactions).toHaveLength(2);
  });

  it("infers hasMore from a full page without total", () => {
    const page = Array.from({ length: 10 }, (_, i) => tx(String(i)));
    const result = normalizeTransactionList(page, { page: 1, limit: 10 });
    expect(result.hasMore).toBe(true);
    expect(result.totalReliable).toBe(false);
  });

  it("handles docs/items envelopes and hasNextPage", () => {
    const result = normalizeTransactionList(
      {
        docs: [tx("1")],
        page: 2,
        limit: 10,
        hasNextPage: false,
      },
      { page: 1, limit: 10 },
    );
    expect(result.page).toBe(2);
    expect(result.hasMore).toBe(false);
    expect(result.total).toBe(11);
    expect(result.totalReliable).toBe(true);
  });

  it("returns empty list for invalid data", () => {
    expect(normalizeTransactionList(null, { page: 1, limit: 10 })).toEqual({
      transactions: [],
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
      totalReliable: true,
    });
  });

  it("uses totalPages when explicit total is missing", () => {
    const result = normalizeTransactionList(
      {
        items: [tx("1")],
        page: 1,
        limit: 10,
        totalPages: 3,
      },
      { page: 1, limit: 10 },
    );
    expect(result.hasMore).toBe(true);
    expect(result.total).toBe(30);
  });
});
