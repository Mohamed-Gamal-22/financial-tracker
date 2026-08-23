"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { getMonthlyBudgetByMonth } from "@/services/api/monthlyBudget";
import { getTransactionSummary } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { currentYearMonth, formatMoney } from "@/lib/format";
import BudgetHeader from "./components/BudgetHeader";
import BudgetSetup from "./components/BudgetSetup";
import BudgetProgress from "./components/BudgetProgress";
import BudgetOverallSummary from "./components/BudgetOverallSummary";
import BudgetHistoryList from "./components/BudgetHistoryList";

function sumSection(
  rows: Array<{ total?: number }> | undefined,
): number {
  if (!rows?.length) return 0;
  return rows.reduce((acc, row) => acc + (Number(row.total) || 0), 0);
}

export default function BudgetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(currentYearMonth);

  const {
    data: budget,
    isLoading: budgetLoading,
    isError: budgetError,
    error: budgetErr,
    refetch: refetchBudget,
    isFetching: budgetFetching,
  } = useQuery({
    queryKey: ["monthly-budget", month],
    queryFn: async () => {
      try {
        const response = await getMonthlyBudgetByMonth(month);
        return response.data ?? null;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
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

  const totalIncome = useMemo(
    () => sumSection(summary?.income),
    [summary?.income],
  );

  const actualExpenses = budget?.actualExpenses ?? sumSection(summary?.expense);

  const isLoading = budgetLoading || summaryLoading;
  const isError = budgetError || summaryError;
  const isFetching = budgetFetching || summaryFetching;
  const errorMessage =
    budgetErr instanceof ApiError
      ? budgetErr.message
      : summaryErr instanceof ApiError
        ? summaryErr.message
        : budgetErr instanceof Error
          ? budgetErr.message
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
          />

          {isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  void refetchBudget();
                  void refetchSummary();
                }}
                disabled={isFetching}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : (
            <>
              {!isLoading && budget && budget.expenseAmount > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
                    <p className="text-xs font-bold text-text-muted">سقف المصروف</p>
                    <p className="mt-2 text-2xl font-extrabold text-primary tabular-nums tracking-tight">
                      {formatMoney(budget.expenseAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
                    <p className="text-xs font-bold text-text-muted">المصروف الفعلي</p>
                    <p className="mt-2 text-2xl font-extrabold text-text-main tabular-nums tracking-tight">
                      {formatMoney(actualExpenses)}
                    </p>
                  </div>
                </div>
              )}

              <BudgetSetup
                month={month}
                budget={budget}
                totalIncome={totalIncome}
                isLoading={isLoading}
              />

              <BudgetProgress
                expenseCap={budget?.expenseAmount ?? 0}
                actualExpenses={actualExpenses}
                isLoading={isLoading}
              />

              <BudgetOverallSummary
                budget={budget}
                totalIncome={totalIncome}
                isLoading={isLoading}
              />

              <BudgetHistoryList
                activeMonth={month}
                onSelectMonth={setMonth}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
