"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { getBudgets, resolveBudgetCategory } from "@/services/api/budget";
import { getTransactionSummary } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { currentYearMonth } from "@/lib/format";
import BudgetHeader from "./components/BudgetHeader";
import BudgetList, { type BudgetCompareRow } from "./components/BudgetList";
import BudgetFormModal from "./components/BudgetFormModal";

export default function BudgetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [month, setMonth] = useState(currentYearMonth);

  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    isError: budgetsError,
    error: budgetsErr,
    refetch: refetchBudgets,
    isFetching: budgetsFetching,
  } = useQuery({
    queryKey: ["budgets", month],
    queryFn: async () => (await getBudgets(month)).data ?? [],
  });

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
    refetch: refetchSummary,
    isFetching: summaryFetching,
  } = useQuery({
    queryKey: ["transaction-summary", month],
    queryFn: async () => (await getTransactionSummary(month)).data,
  });

  const spentByCategoryId = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of summary?.expense ?? []) {
      const id = row.category?._id;
      if (!id) continue;
      map.set(id, Number(row.total) || 0);
    }
    return map;
  }, [summary]);

  const rows: BudgetCompareRow[] = useMemo(
    () =>
      budgets.map((budget) => {
        const category = resolveBudgetCategory(budget.category);
        const id = category?._id ?? "";
        return {
          budget,
          spent: id ? (spentByCategoryId.get(id) ?? 0) : 0,
        };
      }),
    [budgets, spentByCategoryId],
  );

  const isLoading = budgetsLoading || summaryLoading;
  const isError = budgetsError || summaryError;
  const isFetching = budgetsFetching || summaryFetching;
  const errorMessage =
    budgetsErr instanceof ApiError
      ? budgetsErr.message
      : summaryErr instanceof ApiError
        ? summaryErr.message
        : budgetsErr instanceof Error
          ? budgetsErr.message
          : summaryErr instanceof Error
            ? summaryErr.message
            : "تعذر تحميل بيانات الميزانية";

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="budget"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
          <BudgetHeader
            onOpenSidebar={() => setSidebarOpen(true)}
            month={month}
            onMonthChange={setMonth}
            onAddBudget={() => setCreateOpen(true)}
          />

          {isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  void refetchBudgets();
                  void refetchSummary();
                }}
                disabled={isFetching}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : (
            <BudgetList rows={rows} isLoading={isLoading} />
          )}
        </div>
      </main>

      <BudgetFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        month={month}
        mode="create"
      />
    </div>
  );
}
