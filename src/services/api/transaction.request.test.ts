import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./authed-client", () => ({
  authedApiRequest: vi.fn(),
}));

import { authedApiRequest } from "./authed-client";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionReport,
  getTransactionSummary,
  getTransactionsCount,
  listTransactions,
  updateTransaction,
} from "./transaction";

describe("transaction API wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createTransaction includes optional date and lang", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { _id: "1" },
    });
    await createTransaction({
      title: "راتب",
      amount: 100,
      category: "income",
      date: "2026-03-01",
    });
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/transaction?lang=ar"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          title: "راتب",
          amount: 100,
          category: "income",
          date: "2026-03-01",
        }),
      }),
    );
  });

  it("update / delete / get / summary / report hit expected paths", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: {},
    });
    await updateTransaction("1", { title: "جديد" });
    await deleteTransaction("1");
    await getTransaction("1");
    await getTransactionSummary("2026-03");
    await getTransactionReport({ type: "month", month: "2026-03" });

    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/transaction/1"),
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/transaction/1"),
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      "/transaction/1",
      expect.objectContaining({ method: "GET" }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      "/transaction/summary?month=2026-03",
      expect.objectContaining({ method: "GET" }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      "/transaction/report?type=month&month=2026-03",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("listTransactions normalizes the response envelope", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: [{ _id: "1", title: "x", amount: 1, date: "2026-03-01", category: "expense" }],
      total: 1,
    } as never);

    const result = await listTransactions({ page: 1, limit: 10, month: "2026-03" });
    expect(result.data.transactions).toHaveLength(1);
    expect(result.data.total).toBe(1);
    expect(authedApiRequest).toHaveBeenCalledWith(
      "/transaction?page=1&limit=10&month=2026-03",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("getTransactionsCount uses reliable total when available", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: {
        transactions: [{ _id: "1", title: "x", amount: 1, date: "2026-03-01", category: "expense" }],
        page: 1,
        limit: 1,
        total: 42,
        hasMore: true,
        totalReliable: true,
      },
    });

    // listTransactions re-normalizes; pass array + envelope total so totalReliable stays true
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: [{ _id: "1", title: "x", amount: 1, date: "2026-03-01", category: "expense" }],
      total: 42,
    } as never);

    await expect(getTransactionsCount({ month: "2026-03" })).resolves.toBe(42);
  });

  it("getTransactionsCount walks pages when total is unreliable", async () => {
    vi.mocked(authedApiRequest)
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: Array.from({ length: 1 }, (_, i) => ({
          _id: String(i),
          title: "x",
          amount: 1,
          date: "2026-03-01",
          category: "expense",
        })),
      })
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: Array.from({ length: 100 }, (_, i) => ({
          _id: `p1-${i}`,
          title: "x",
          amount: 1,
          date: "2026-03-01",
          category: "expense",
        })),
      })
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: Array.from({ length: 2 }, (_, i) => ({
          _id: `p2-${i}`,
          title: "x",
          amount: 1,
          date: "2026-03-01",
          category: "expense",
        })),
      });

    await expect(getTransactionsCount()).resolves.toBe(102);
  });
});
