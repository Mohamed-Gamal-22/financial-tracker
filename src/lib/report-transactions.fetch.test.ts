import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/api/transaction", () => ({
  listTransactions: vi.fn(),
}));

vi.mock("@/lib/format", async () => {
  const actual = await vi.importActual<typeof import("@/lib/format")>(
    "@/lib/format",
  );
  return {
    ...actual,
    currentYearMonth: () => "2026-03",
  };
});

import { listTransactions } from "@/services/api/transaction";
import {
  fetchMonthExpenses,
  fetchReportTransactions,
} from "./report-transactions";
import type { Transaction } from "@/schemas/transaction.schema";

const tx = (id: string, date: string): Transaction => ({
  _id: id,
  title: id,
  amount: 1,
  date,
  category: "expense",
});

describe("fetchReportTransactions / fetchMonthExpenses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("paginates until hasMore is false", async () => {
    vi.mocked(listTransactions)
      .mockResolvedValueOnce({
        message: "",
        success: true,
        status: 200,
        data: {
          transactions: [tx("1", "2026-03-01")],
          page: 1,
          limit: 100,
          total: 2,
          hasMore: true,
        },
      })
      .mockResolvedValueOnce({
        message: "",
        success: true,
        status: 200,
        data: {
          transactions: [tx("2", "2026-03-02")],
          page: 2,
          limit: 100,
          total: 2,
          hasMore: false,
        },
      });

    const result = await fetchReportTransactions({
      type: "month",
      month: "2026-03",
    });
    expect(result).toHaveLength(2);
    expect(listTransactions).toHaveBeenCalledTimes(2);
  });

  it("filters day reports by exact date", async () => {
    vi.mocked(listTransactions).mockResolvedValue({
      message: "",
      success: true,
      status: 200,
      data: {
        transactions: [
          tx("1", "2026-03-15"),
          tx("2", "2026-03-16T00:00:00.000Z"),
          tx("3", "2026-03-15T10:00:00.000Z"),
        ],
        page: 1,
        limit: 100,
        total: 3,
        hasMore: false,
      },
    });

    const result = await fetchReportTransactions({
      type: "day",
      date: "2026-03-15",
    });
    expect(result.map((t) => t._id).sort()).toEqual(["1", "3"]);
  });

  it("requests expense category for month expenses", async () => {
    vi.mocked(listTransactions).mockResolvedValue({
      message: "",
      success: true,
      status: 200,
      data: {
        transactions: [],
        page: 1,
        limit: 100,
        total: 0,
        hasMore: false,
      },
    });

    await fetchMonthExpenses("2026-03");
    expect(listTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        month: "2026-03",
        categoryType: "expense",
      }),
    );
  });
});
