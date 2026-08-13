"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { listTransactions } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsToolbar, {
  type CategoryTypeFilter,
} from "./components/TransactionsToolbar";
import TransactionsTable from "./components/TransactionsTable";
import CreateTransactionModal from "./components/CreateTransactionModal";
import DeleteTransactionDialog from "./components/DeleteTransactionDialog";
import TransactionDetailModal from "./components/TransactionDetailModal";

const LIMIT = 10;

export default function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [categoryType, setCategoryType] = useState<CategoryTypeFilter>("all");
  const [month, setMonth] = useState("");
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryName, setCategoryName] = useState("");

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

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "transactions",
      {
        page,
        limit: LIMIT,
        categoryType,
        categoryName,
        month,
      },
    ],
    queryFn: async () => {
      const response = await listTransactions({
        page,
        limit: LIMIT,
        categoryType: categoryType === "all" ? undefined : categoryType,
        categoryName: categoryName || undefined,
        month: month || undefined,
      });
      return (
        response.data ?? {
          transactions: [],
          page: 1,
          limit: LIMIT,
          total: 0,
        }
      );
    },
    placeholderData: (previous) => previous,
  });

  function afterCreate() {
    setPage(1);
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل المعاملات";

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;

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
            month={month}
            onMonthChange={(value) => {
              setMonth(value);
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
              page={currentPage}
              limit={LIMIT}
              total={total}
              isLoading={isLoading}
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
      />
    </div>
  );
}
