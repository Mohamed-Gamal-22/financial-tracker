import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./authed-client", () => ({
  authedApiRequest: vi.fn(),
}));

import { authedApiRequest } from "./authed-client";
import {
  createMonthlyBudget,
  deleteMonthlyBudget,
  getMonthlyBudget,
  getMonthlyBudgetByMonth,
  listMonthlyBudgets,
  updateMonthlyBudget,
} from "./monthlyBudget";

describe("monthlyBudget API wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create / update normalize returned budgets", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { _id: "b1", month: "2026-03", expenseAmount: "1000" },
    });

    await expect(
      createMonthlyBudget({ month: "2026-03", expenseAmount: 1000 }),
    ).resolves.toMatchObject({
      data: { _id: "b1", month: "2026-03", expenseAmount: 1000 },
    });

    await expect(
      updateMonthlyBudget("b1", { expenseAmount: 2000 }),
    ).resolves.toMatchObject({
      data: { _id: "b1", month: "2026-03" },
    });
  });

  it("listMonthlyBudgets maps list + total object", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: {
        budgets: [{ _id: "b1", month: "2026-03", expenseAmount: 10 }],
        total: { expenseAmount: 10 },
      },
    });

    const result = await listMonthlyBudgets();
    expect(result.data.budgets).toHaveLength(1);
    expect(result.data.total).toEqual({ expenseAmount: 10 });
  });

  it("get by month / id and delete", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { _id: "b1", month: "2026-03", expenseAmount: 10 },
    });

    await expect(getMonthlyBudgetByMonth("2026-03")).resolves.toMatchObject({
      data: { _id: "b1" },
    });
    await expect(getMonthlyBudget("b1")).resolves.toMatchObject({
      data: { _id: "b1" },
    });

    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
    });
    await deleteMonthlyBudget("b1");
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/monthlyBudget/b1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
