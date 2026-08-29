import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./transaction", () => ({
  getTransactionSummary: vi.fn(),
  listTransactions: vi.fn(),
}));

import { getTransactionSummary, listTransactions } from "./transaction";
import { getCategoriesForTransaction } from "./category";

describe("getCategoriesForTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("merges categories from summary and transactions", async () => {
    vi.mocked(getTransactionSummary).mockResolvedValue({
      message: "",
      success: true,
      status: 200,
      data: {
        income: [{ category: "income", count: 1, total: 10 }],
        expense: [],
        savings: [],
      },
    });
    vi.mocked(listTransactions).mockResolvedValue({
      message: "",
      success: true,
      status: 200,
      data: {
        transactions: [
          {
            _id: "1",
            title: "x",
            amount: 1,
            date: "2026-03-01",
            category: "expense",
          },
        ],
        page: 1,
        limit: 100,
        total: 1,
        hasMore: false,
      },
    });

    const categories = await getCategoriesForTransaction();
    expect(categories.map((c) => c.type).sort()).toEqual([
      "expense",
      "income",
    ]);
  });

  it("falls back to synthetic categories when sources are empty", async () => {
    vi.mocked(getTransactionSummary).mockRejectedValue(new Error("empty"));
    vi.mocked(listTransactions).mockRejectedValue(new Error("empty"));

    const categories = await getCategoriesForTransaction();
    expect(categories).toEqual([
      { _id: "income", name: "دخل", type: "income" },
      { _id: "expense", name: "مصروف", type: "expense" },
      { _id: "savings", name: "ادخار", type: "savings" },
    ]);
  });
});
