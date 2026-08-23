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
  UpdateTransactionInput,
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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return null;
}

function pickFirstNumber(
  rows: Array<Record<string, unknown> | null | undefined>,
  keys: string[],
): number | null {
  for (const row of rows) {
    if (!row) continue;
    for (const key of keys) {
      const n = readFiniteNumber(row[key]);
      if (n != null) return n;
    }
  }
  return null;
}

function resolveTotalCandidate(
  rows: Array<Record<string, unknown> | null | undefined>,
  pageLength: number,
  pageLimit: number,
): number | null {
  const explicit = pickFirstNumber(rows, [
    "total",
    "totalDocs",
    "totalCount",
    "totalItems",
    "resultsTotal",
  ]);
  if (explicit != null) return explicit;

  const count = pickFirstNumber(rows, ["count"]);
  if (count == null) return null;
  // Ignore count when it only mirrors this page's length on a full page.
  if (count === pageLength && pageLength >= pageLimit) return null;
  return count;
}

/**
 * Backend pagination shape varies; docs noted the field names as assumed.
 * Normalize common shapes into `{ transactions, page, limit, total, hasMore }`.
 *
 * @param envelope Full API payload — some backends put `total` beside `data`.
 */
export function normalizeTransactionList(
  data: unknown,
  fallback: { page: number; limit: number },
  envelope?: unknown,
): TransactionListData {
  const page = fallback.page;
  const limit = fallback.limit;
  const envelopeRecord = asRecord(envelope);
  const envelopePagination =
    asRecord(envelopeRecord?.pagination) ?? asRecord(envelopeRecord?.meta);

  if (Array.isArray(data)) {
    const transactions = data as Transaction[];
    const total = resolveTotalCandidate(
      [envelopeRecord, envelopePagination],
      transactions.length,
      limit,
    );
    if (total != null) {
      return {
        transactions,
        page:
          pickFirstNumber([envelopeRecord, envelopePagination], ["page"]) ??
          page,
        limit:
          pickFirstNumber([envelopeRecord, envelopePagination], ["limit"]) ??
          limit,
        total,
        hasMore: page * limit < total,
        totalReliable: true,
      };
    }
    const hasMore = transactions.length >= limit;
    return {
      transactions,
      page,
      limit,
      total: hasMore
        ? page * limit + 1
        : (page - 1) * limit + transactions.length,
      hasMore,
      totalReliable: !hasMore,
    };
  }

  const root = asRecord(data);
  if (!root) {
    return {
      transactions: [],
      page,
      limit,
      total: 0,
      hasMore: false,
      totalReliable: true,
    };
  }

  const nested = asRecord(root.data);
  const pagination =
    asRecord(root.pagination) ??
    asRecord(root.meta) ??
    asRecord(nested?.pagination) ??
    asRecord(nested?.meta) ??
    envelopePagination;

  const source = nested ?? root;
  const rows = [source, pagination, root, envelopeRecord, envelopePagination];

  const listCandidate =
    source.transactions ??
    source.docs ??
    source.items ??
    source.results ??
    root.transactions ??
    root.docs ??
    (Array.isArray(source.data) ? source.data : undefined) ??
    (Array.isArray(root.data) ? root.data : undefined);

  const transactions = Array.isArray(listCandidate)
    ? (listCandidate as Transaction[])
    : [];

  const resolvedPage = pickFirstNumber(rows, ["page"]) ?? page;
  const resolvedLimit = pickFirstNumber(rows, ["limit"]) ?? limit;
  const totalPages = pickFirstNumber(rows, ["totalPages", "pages"]);
  const explicitTotal = resolveTotalCandidate(
    rows,
    transactions.length,
    resolvedLimit,
  );

  const hasNextFlag = rows.reduce<boolean | null>((acc, row) => {
    if (acc != null || !row) return acc;
    if (row.hasNextPage === true || row.hasMore === true) return true;
    if (row.hasNextPage === false || row.hasMore === false) return false;
    return null;
  }, null);

  const fullPage = transactions.length >= resolvedLimit;

  let total: number;
  let hasMore: boolean;
  let totalReliable = false;

  if (explicitTotal != null) {
    total = explicitTotal;
    hasMore = resolvedPage * resolvedLimit < total;
    totalReliable = true;
  } else if (totalPages != null) {
    total =
      resolvedPage >= totalPages
        ? (resolvedPage - 1) * resolvedLimit + transactions.length
        : totalPages * resolvedLimit;
    hasMore = resolvedPage < totalPages;
    totalReliable = resolvedPage >= totalPages || explicitTotal != null;
  } else if (hasNextFlag === true) {
    total = resolvedPage * resolvedLimit + 1;
    hasMore = true;
  } else if (hasNextFlag === false) {
    total = (resolvedPage - 1) * resolvedLimit + transactions.length;
    hasMore = false;
    totalReliable = true;
  } else if (fullPage) {
    total = resolvedPage * resolvedLimit + 1;
    hasMore = true;
  } else {
    total = (resolvedPage - 1) * resolvedLimit + transactions.length;
    hasMore = false;
    totalReliable = true;
  }

  return {
    transactions,
    page: resolvedPage,
    limit: resolvedLimit,
    total,
    hasMore,
    totalReliable,
  };
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

/** PATCH /transaction/:id?lang=ar */
export function updateTransaction(id: string, body: UpdateTransactionInput) {
  const payload: Record<string, string | number> = {};
  if (body.title !== undefined) payload.title = body.title;
  if (body.amount !== undefined) payload.amount = body.amount;
  if (body.category !== undefined) payload.category = body.category;
  if (body.date !== undefined && body.date !== "") payload.date = body.date;

  return authedApiRequest<Transaction>(withLangQuery(`/transaction/${id}`), {
    method: "PATCH",
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
    // Pass full payload so totals living beside `data` are not dropped.
    data: normalizeTransactionList(response.data, { page, limit }, response),
  };
}

/**
 * Full transaction count for the active filters (independent of the UI page).
 * Prefers API `total` when reliable; otherwise walks pages and sums.
 */
export async function getTransactionsCount(
  params: Omit<ListTransactionsParams, "page" | "limit"> = {},
): Promise<number> {
  const probe = await listTransactions({
    ...params,
    page: 1,
    limit: 1,
  });
  const probed = probe.data;
  if (
    probed &&
    probed.totalReliable &&
    typeof probed.total === "number" &&
    Number.isFinite(probed.total)
  ) {
    return probed.total;
  }

  let page = 1;
  let total = 0;
  const pageSize = 100;

  for (;;) {
    const response = await listTransactions({
      ...params,
      page,
      limit: pageSize,
    });
    const batch = response.data?.transactions?.length ?? 0;
    total += batch;
    const hasMore = response.data?.hasMore === true || batch >= pageSize;
    if (!hasMore || batch === 0) break;
    page += 1;
    if (page > 100) break;
  }

  return total;
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
