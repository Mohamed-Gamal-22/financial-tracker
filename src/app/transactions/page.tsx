"use client";

import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import {
  getTransactionsCount,
  listTransactions,
} from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import {
  isIsoDate,
  normalizeTxDate,
  yearMonthFromPeriod,
} from "@/lib/date-value";
import type { Transaction } from "@/schemas/transaction.schema";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsToolbar, {
  type CategoryTypeFilter,
} from "./components/TransactionsToolbar";
import TransactionsTable from "./components/TransactionsTable";
import CreateTransactionModal from "./components/CreateTransactionModal";
import DeleteTransactionDialog from "./components/DeleteTransactionDialog";
import TransactionDetailModal from "./components/TransactionDetailModal";

const LIMIT = 10;
const DAY_FETCH_LIMIT = 100;

async function fetchAllMonthTransactions(params: {
  categoryType?: CategoryTypeFilter;
  categoryName?: string;
  month: string;
}): Promise<Transaction[]> {
  const all: Transaction[] = [];
  let page = 1;

  for (;;) {
    const response = await listTransactions({
      page,
      limit: DAY_FETCH_LIMIT,
      categoryType:
        params.categoryType === "all" ? undefined : params.categoryType,
      categoryName: params.categoryName || undefined,
      month: params.month,
    });
    const chunk = response.data?.transactions ?? [];
    all.push(...chunk);
    if (!response.data?.hasMore || chunk.length === 0) break;
    page += 1;
    if (page > 50) break;
  }

  return all;
}

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-start to-bg-end">
          <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
        </div>
      }
    >
      <TransactionsPageContent />
    </Suspense>
  );
}

function TransactionsPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = (searchParams.get("q") ?? searchParams.get("categoryName") ?? "").trim();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [categoryType, setCategoryType] = useState<CategoryTypeFilter>("all");
  /** YYYY-MM (month) or YYYY-MM-DD (day). */
  const [period, setPeriod] = useState("");
  const [categoryNameInput, setCategoryNameInput] = useState(initialQuery);
  const [categoryName, setCategoryName] = useState(initialQuery);

  const dayFilter = isIsoDate(period) ? period : "";
  const monthFilter = yearMonthFromPeriod(period);

  useEffect(() => {
    const next = (searchParams.get("q") ?? searchParams.get("categoryName") ?? "").trim();
    setCategoryNameInput(next);
    setCategoryName(next);
    setPage(1);
    if (searchParams.get("add") === "1") {
      setCreateOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = categoryNameInput.trim();
      setCategoryName((prev) => {
        if (prev !== next) setPage(1);
        return next;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [categoryNameInput]);

  const listFilters = {
    categoryType,
    categoryName,
    period,
  };

  const dayQuery = useQuery({
    queryKey: ["transactions-by-day", listFilters],
    enabled: Boolean(dayFilter),
    queryFn: async () => {
      const all = await fetchAllMonthTransactions({
        categoryType,
        categoryName,
        month: monthFilter,
      });
      return all.filter((tx) => normalizeTxDate(tx.date) === dayFilter);
    },
    placeholderData: (previous) => previous,
  });

  const monthQuery = useQuery({
    queryKey: ["transactions", { page, limit: LIMIT, ...listFilters }],
    enabled: !dayFilter,
    queryFn: async () => {
      const response = await listTransactions({
        page,
        limit: LIMIT,
        categoryType: categoryType === "all" ? undefined : categoryType,
        categoryName: categoryName || undefined,
        month: monthFilter || undefined,
      });
      return (
        response.data ?? {
          transactions: [],
          page: 1,
          limit: LIMIT,
          total: 0,
          hasMore: false,
          totalReliable: true,
        }
      );
    },
    placeholderData: (previous) => previous,
  });

  const {
    data: totalCount = 0,
    isSuccess: countReady,
  } = useQuery({
    queryKey: ["transactions-count", listFilters],
    enabled: !dayFilter,
    queryFn: () =>
      getTransactionsCount({
        categoryType: categoryType === "all" ? undefined : categoryType,
        categoryName: categoryName || undefined,
        month: monthFilter || undefined,
      }),
    staleTime: 30_000,
  });

  function afterCreate() {
    setPage(1);
  }

  const activeQuery = dayFilter ? dayQuery : monthQuery;
  const { isLoading, isError, error, refetch, isFetching } = activeQuery;

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل المعاملات";

  let transactions: Transaction[] = [];
  let total = 0;
  let hasMore = false;

  if (dayFilter) {
    const filtered = dayQuery.data ?? [];
    total = filtered.length;
    const start = (page - 1) * LIMIT;
    transactions = filtered.slice(start, start + LIMIT);
    hasMore = page * LIMIT < total;
  } else {
    transactions = monthQuery.data?.transactions ?? [];
    total = countReady ? totalCount : (monthQuery.data?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT) || 1);
    hasMore = countReady
      ? page < totalPages
      : (monthQuery.data?.hasMore ??
        page * LIMIT < Math.max(total, page * LIMIT));
  }

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="transactions"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
          <TransactionsHeader
            onOpenSidebar={() => setSidebarOpen(true)}
            onAddTransaction={() => setCreateOpen(true)}
          />

          <TransactionsToolbar
            categoryType={categoryType}
            onCategoryTypeChange={(value) => {
              setCategoryType(value);
              setPage(1);
            }}
            categoryName={categoryNameInput}
            onCategoryNameChange={setCategoryNameInput}
            month={period}
            onMonthChange={(value) => {
              setPeriod(value);
              setPage(1);
            }}
          />

          {isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : (
            <TransactionsTable
              transactions={transactions}
              page={page}
              limit={LIMIT}
              total={total}
              hasMore={hasMore}
              isLoading={isLoading || isFetching}
              onPageChange={setPage}
              onOpenDetail={setDetailId}
              onDelete={(id, title) => setDeleteTarget({ id, title })}
            />
          )}
        </div>
      </main>

      <CreateTransactionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        categoryTypeFilter={categoryType}
        onCreated={afterCreate}
      />

      <TransactionDetailModal
        open={Boolean(detailId)}
        transactionId={detailId}
        onClose={() => setDetailId(null)}
      />

      <DeleteTransactionDialog
        open={Boolean(deleteTarget)}
        transactionId={deleteTarget?.id ?? ""}
        transactionTitle={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => setPage(1)}
      />
    </div>
  );
}
