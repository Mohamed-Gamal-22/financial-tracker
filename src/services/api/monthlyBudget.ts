import { authedApiRequest } from "./authed-client";
import { withLangQuery } from "./client";
import type {
  CreateMonthlyBudgetInput,
  MonthlyBudget,
  MonthlyBudgetListData,
  UpdateMonthlyBudgetInput,
} from "@/schemas/monthlyBudget.schema";

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

function readNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function readId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  const row = asRecord(value);
  const id = row?._id ?? row?.id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

export function normalizeMonthlyBudget(raw: unknown): MonthlyBudget | null {
  const row = asRecord(raw);
  if (!row) return null;

  const id = readId(row._id) ?? readId(row.id);
  const month =
    typeof row.month === "string" && /^\d{4}-\d{2}$/.test(row.month)
      ? row.month
      : "";

  if (!id || !month) return null;

  return {
    _id: id,
    month,
    expenseAmount: readNumber(row.expenseAmount),
    savingsAmount: readNumber(row.savingsAmount),
    actualExpenses: readNumber(row.actualExpenses),
    actualSavings: readNumber(row.actualSavings),
    remainingExpenseBudget: readNumber(row.remainingExpenseBudget),
    remainingSavings: readNumber(row.remainingSavings),
  };
}

function normalizeMonthlyBudgetList(data: unknown): MonthlyBudget[] {
  if (Array.isArray(data)) {
    return data
      .map(normalizeMonthlyBudget)
      .filter((item): item is MonthlyBudget => item != null);
  }

  const root = asRecord(data);
  if (!root) return [];

  const nested = root.budgets ?? root.items ?? root.data;
  if (Array.isArray(nested)) {
    return nested
      .map(normalizeMonthlyBudget)
      .filter((item): item is MonthlyBudget => item != null);
  }

  const single = normalizeMonthlyBudget(data);
  return single ? [single] : [];
}

/** POST /monthlyBudget?lang=ar */
export function createMonthlyBudget(body: CreateMonthlyBudgetInput) {
  return authedApiRequest<MonthlyBudget>(withLangQuery("/monthlyBudget"), {
    method: "POST",
    body: JSON.stringify(body),
  }).then((response) => ({
    ...response,
    data: normalizeMonthlyBudget(response.data) ?? undefined,
  }));
}

/** PATCH /monthlyBudget/:id?lang=ar */
export function updateMonthlyBudget(id: string, body: UpdateMonthlyBudgetInput) {
  return authedApiRequest<MonthlyBudget>(withLangQuery(`/monthlyBudget/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  }).then((response) => ({
    ...response,
    data: normalizeMonthlyBudget(response.data) ?? undefined,
  }));
}

/** DELETE /monthlyBudget/:id?lang=ar */
export function deleteMonthlyBudget(id: string) {
  return authedApiRequest(withLangQuery(`/monthlyBudget/${id}`), {
    method: "DELETE",
  });
}

/** GET /monthlyBudget?lang=ar */
export async function listMonthlyBudgets() {
  const response = await authedApiRequest<unknown>(
    withLangQuery("/monthlyBudget"),
    { method: "GET" },
  );

  const root = asRecord(response.data);
  const budgets = normalizeMonthlyBudgetList(response.data);
  const total =
    root?.total && typeof root.total === "object" && !Array.isArray(root.total)
      ? (root.total as Record<string, number>)
      : undefined;

  return {
    ...response,
    data: { budgets, total } satisfies MonthlyBudgetListData,
  };
}

/** GET /monthlyBudget/month?month=YYYY-MM&lang=ar */
export async function getMonthlyBudgetByMonth(month: string) {
  const qs = toQuery({ month });
  const response = await authedApiRequest<unknown>(
    withLangQuery(`/monthlyBudget/month${qs}`),
    { method: "GET" },
  );

  return {
    ...response,
    data: normalizeMonthlyBudget(response.data),
  };
}

/** GET /monthlyBudget/:id?lang=ar */
export async function getMonthlyBudget(id: string) {
  const response = await authedApiRequest<unknown>(
    withLangQuery(`/monthlyBudget/${id}`),
    { method: "GET" },
  );

  return {
    ...response,
    data: normalizeMonthlyBudget(response.data),
  };
}
