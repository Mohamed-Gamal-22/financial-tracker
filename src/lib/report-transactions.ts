import { normalizeTxDate } from "@/lib/date-value";
import { categoryTypeOf, currentYearMonth } from "@/lib/format";
import { listTransactions } from "@/services/api/transaction";
import type { CategoryType } from "@/schemas/category.schema";
import type { ReportParams, Transaction } from "@/schemas/transaction.schema";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

async function fetchAllForMonth(
  month: string,
  categoryType?: CategoryType,
): Promise<Transaction[]> {
  const all: Transaction[] = [];
  let page = 1;

  for (;;) {
    const response = await listTransactions({
      page,
      limit: PAGE_SIZE,
      month,
      categoryType,
    });
    const chunk = response.data?.transactions ?? [];
    all.push(...chunk);
    if (!response.data?.hasMore || chunk.length === 0) break;
    page += 1;
    if (page > MAX_PAGES) break;
  }

  return all;
}

function reportMonth(params: ReportParams): string {
  if ("type" in params && params.type === "month") {
    return params.month;
  }
  if ("type" in params && params.type === "day") {
    return params.date.slice(0, 7);
  }
  return currentYearMonth();
}

/** Load all transactions for the same period as GET /transaction/report. */
export async function fetchReportTransactions(
  params: ReportParams = {},
): Promise<Transaction[]> {
  const month = reportMonth(params);
  const transactions = await fetchAllForMonth(month);

  if ("type" in params && params.type === "day") {
    return transactions.filter(
      (tx) => normalizeTxDate(tx.date) === params.date,
    );
  }

  return transactions;
}

export type TransactionsByType = Record<CategoryType, Transaction[]>;

/** Group transactions into income / expense / savings buckets. */
export function groupTransactionsByType(
  transactions: Transaction[],
): TransactionsByType {
  const grouped: TransactionsByType = {
    income: [],
    expense: [],
    savings: [],
  };

  for (const tx of transactions) {
    const type = categoryTypeOf(tx.category);
    if (type) grouped[type].push(tx);
  }

  return grouped;
}

/** All expense transactions for a month (for dashboard breakdown). */
export async function fetchMonthExpenses(month: string): Promise<Transaction[]> {
  return fetchAllForMonth(month, "expense");
}
