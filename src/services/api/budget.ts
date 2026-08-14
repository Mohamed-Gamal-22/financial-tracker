import { authedApiRequest } from "./authed-client";
import { withLangQuery } from "./client";
import type {
  Budget,
  BudgetCategoryRef,
  CreateBudgetInput,
  UpdateBudgetInput,
} from "@/schemas/budget.schema";
import type { CategoryType } from "@/schemas/category.schema";

function toQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  const row = asRecord(value);
  if (!row) return null;
  const id = row._id ?? row.id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const row = asRecord(value);
  if (row && "$numberDecimal" in row) {
    return readNumber(row.$numberDecimal);
  }
  return null;
}

/** Read budget cap from common backend field names. */
export function readBudgetAmount(row: Record<string, unknown>): number {
  const candidates = [
    row.amount,
    row.budget,
    row.limit,
    row.value,
    row.budgetAmount,
    row.maxAmount,
    row.monthlyBudget,
  ];
  for (const candidate of candidates) {
    const amount = readNumber(candidate);
    if (amount != null) return amount;
  }
  return 0;
}

export function resolveBudgetCategory(
  category: Budget["category"] | Record<string, unknown> | null | undefined,
): BudgetCategoryRef | null {
  if (!category) return null;
  if (typeof category === "string") {
    return { _id: category, name: "—" };
  }
  const row = asRecord(category);
  if (!row) return null;
  const id = readId(row);
  if (!id) return null;
  const name =
    typeof row.name === "string" && row.name.trim() ? row.name.trim() : "—";
  const type =
    row.type === "income" || row.type === "expense" || row.type === "savings"
      ? (row.type as CategoryType)
      : undefined;
  return { _id: id, name, type };
}

function normalizeBudgetItem(raw: unknown): Budget | null {
  const row = asRecord(raw);
  if (!row) return null;

  const nestedCategory =
    resolveBudgetCategory(
      (row.category as Budget["category"] | undefined) ??
        (row.categoryId as string | undefined),
    ) ?? null;

  // Some APIs return a flat category+budget row without nested `category`.
  const flatCategory =
    !nestedCategory && (row.name || row.type)
      ? resolveBudgetCategory(row)
      : null;

  const category = nestedCategory ?? flatCategory;
  if (!category) return null;

  const amount = readBudgetAmount(row);
  const month =
    typeof row.month === "string" && /^\d{4}-\d{2}$/.test(row.month)
      ? row.month
      : "";

  const id =
    readId(row._id) ??
    readId(row.id) ??
    `${category._id}:${month || "unknown"}`;

  return {
    _id: id,
    category,
    amount,
    month,
  };
}

function normalizeBudgets(data: unknown): Budget[] {
  let list: unknown[] = [];

  if (Array.isArray(data)) {
    list = data;
  } else {
    const root = asRecord(data);
    if (root) {
      const nested =
        root.budgets ?? root.items ?? root.results ?? root.data ?? root.docs;
      if (Array.isArray(nested)) list = nested;
    }
  }

  const budgets: Budget[] = [];
  for (const item of list) {
    const normalized = normalizeBudgetItem(item);
    if (normalized) budgets.push(normalized);
  }
  return budgets;
}

function finalizeBudgetResponse(
  response: Awaited<ReturnType<typeof authedApiRequest<unknown>>>,
  body: CreateBudgetInput | UpdateBudgetInput,
  fallbackId = "",
) {
  const normalized = normalizeBudgetItem(response.data);
  return {
    ...response,
    data: normalized ?? {
      _id: fallbackId,
      category: body.category,
      amount: body.amount,
      month: body.month,
    },
  };
}

/** POST /budget — include lang so notifications are created in Arabic */
export function createBudget(body: CreateBudgetInput) {
  return authedApiRequest<unknown>(withLangQuery("/budget"), {
    method: "POST",
    body: JSON.stringify({
      category: body.category,
      amount: body.amount,
      month: body.month,
    }),
  }).then((response) => finalizeBudgetResponse(response, body));
}

/** PATCH /budget/:id */
export function updateBudget(id: string, body: UpdateBudgetInput) {
  return authedApiRequest<unknown>(withLangQuery(`/budget/${id}`), {
    method: "PATCH",
    body: JSON.stringify({
      category: body.category,
      amount: body.amount,
      month: body.month,
    }),
  }).then((response) => finalizeBudgetResponse(response, body, id));
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
