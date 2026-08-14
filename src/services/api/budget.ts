import { authedApiRequest } from "./authed-client";
import type {
  Budget,
  BudgetCategoryRef,
  CreateBudgetInput,
} from "@/schemas/budget.schema";

function toQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function resolveBudgetCategory(
  category: Budget["category"],
): BudgetCategoryRef | null {
  if (!category) return null;
  if (typeof category === "string") {
    return { _id: category, name: "—" };
  }
  return category;
}

function normalizeBudgets(data: unknown): Budget[] {
  if (Array.isArray(data)) return data as Budget[];
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const list = root.budgets ?? root.data ?? root.items;
  return Array.isArray(list) ? (list as Budget[]) : [];
}

/** POST /budget */
export function createBudget(body: CreateBudgetInput) {
  return authedApiRequest<Budget>("/budget", {
    method: "POST",
    body: JSON.stringify({
      category: body.category,
      amount: body.amount,
      month: body.month,
    }),
  });
}

/** GET /budget?month=YYYY-MM */
export async function getBudgets(month?: string) {
  const qs = toQuery({ month });
  const response = await authedApiRequest<unknown>(`/budget${qs}`, {
    method: "GET",
  });
  return {
    ...response,
    data: normalizeBudgets(response.data),
  };
}
