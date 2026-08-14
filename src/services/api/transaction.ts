import { authedApiRequest } from "./authed-client";
import { withLangQuery } from "./client";
import type {
  CreateTransactionInput,
  ListTransactionsParams,
  ReportParams,
  Transaction,
  TransactionListData,
  TransactionReportData,
  TransactionSummaryData,
} from "@/schemas/transaction.schema";

function toQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Backend pagination shape varies; docs noted the field names as assumed.
 * Normalize common shapes into `{ transactions, page, limit, total }`.
 */
export function normalizeTransactionList(
  data: unknown,
  fallback: { page: number; limit: number },
): TransactionListData {
  if (Array.isArray(data)) {
    return {
      transactions: data as Transaction[],
      page: fallback.page,
      limit: fallback.limit,
      total: data.length,
    };
  }

  if (!data || typeof data !== "object") {
    return {
      transactions: [],
      page: fallback.page,
      limit: fallback.limit,
      total: 0,
    };
  }

  const root = data as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : null;

  const source = nested ?? root;

  const listCandidate =
    source.transactions ??
    source.docs ??
    source.items ??
    source.results ??
    (Array.isArray(source.data) ? source.data : undefined);

  const transactions = Array.isArray(listCandidate)
    ? (listCandidate as Transaction[])
    : [];

  const page = Number(source.page ?? nested?.page ?? fallback.page) || fallback.page;
  const limit =
    Number(source.limit ?? nested?.limit ?? fallback.limit) || fallback.limit;
  const total =
    Number(
      source.total ??
        source.totalDocs ??
        source.totalCount ??
        source.count ??
        nested?.total ??
        transactions.length,
    ) || transactions.length;

  return { transactions, page, limit, total };
}

/** POST /transaction — include lang so budget notifications are created in Arabic */
export function createTransaction(body: CreateTransactionInput) {
  const payload: Record<string, string | number> = {
    title: body.title,
    amount: body.amount,
    category: body.category,
  };
  if (body.date) payload.date = body.date;

  return authedApiRequest<Transaction>(withLangQuery("/transaction"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** DELETE /transaction/:id */
export function deleteTransaction(id: string) {
  return authedApiRequest(withLangQuery(`/transaction/${id}`), {
    method: "DELETE",
  });
}

/** GET /transaction/:id */
export function getTransaction(id: string) {
  return authedApiRequest<Transaction>(`/transaction/${id}`, { method: "GET" });
}

/** GET /transaction — paginated list with filters */
export async function listTransactions(params: ListTransactionsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const qs = toQuery({
    page,
    limit,
    categoryType: params.categoryType,
    categoryName: params.categoryName,
    month: params.month,
  });
  const response = await authedApiRequest<unknown>(`/transaction${qs}`, {
    method: "GET",
  });

  return {
    ...response,
    data: normalizeTransactionList(response.data, { page, limit }),
  };
}

/** GET /transaction/summary */
export function getTransactionSummary(month?: string) {
  const qs = toQuery({ month });
  return authedApiRequest<TransactionSummaryData>(`/transaction/summary${qs}`, {
    method: "GET",
  });
}

/** GET /transaction/report */
export function getTransactionReport(params: ReportParams = {}) {
  const qs = toQuery(params as Record<string, string | undefined>);
  return authedApiRequest<TransactionReportData>(`/transaction/report${qs}`, {
    method: "GET",
  });
}
