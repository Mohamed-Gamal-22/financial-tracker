"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { getCategories } from "@/services/api/category";
import { getBudgets, resolveBudgetCategory } from "@/services/api/budget";
import { getTransactionSummary } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { currentYearMonth, formatMoney } from "@/lib/format";
import BudgetHeader from "./components/BudgetHeader";
import BudgetSetup from "./components/BudgetSetup";
import BudgetProgress, {
  type BudgetProgressRow,
} from "./components/BudgetProgress";
import BudgetOverallSummary from "./components/BudgetOverallSummary";

export default function BudgetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(currentYearMonth);
  /** Fallback when GET /budget returns rows without a usable amount. */
  const [amountOverrides, setAmountOverrides] = useState<
    Record<string, Record<string, number>>
  >({});

  const monthOverrides = amountOverrides[month] ?? {};

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErr,
    refetch: refetchCategories,
    isFetching: categoriesFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await getCategories()).data ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const expenseCategories = useMemo(
    () =>
      categories
        .filter((category) => category.type === "expense")
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "ar")),
    [categories],
  );

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

  const progressRows: BudgetProgressRow[] = useMemo(() => {
    const byCategory = new Map<string, BudgetProgressRow>();

    for (const budget of budgets) {
      const category = resolveBudgetCategory(budget.category);
      if (!category?._id) continue;
      const override = monthOverrides[category._id];
      const cap =
        (typeof override === "number" && override > 0
          ? override
          : Number(budget.amount) || 0) || 0;
      if (cap <= 0) continue;

      const spent = spentByCategoryId.get(category._id) ?? 0;
      byCategory.set(category._id, {
        id: category._id,
        name:
          category.name !== "—"
            ? category.name
            : (expenseCategories.find((item) => item._id === category._id)
                ?.name ?? "تصنيف"),
        cap,
        spent,
      });
    }

    // Include overrides for categories the API still returns with amount 0.
    for (const [categoryId, cap] of Object.entries(monthOverrides)) {
      if (cap <= 0 || byCategory.has(categoryId)) continue;
      const category = expenseCategories.find((item) => item._id === categoryId);
      byCategory.set(categoryId, {
        id: categoryId,
        name: category?.name ?? "تصنيف",
        cap,
        spent: spentByCategoryId.get(categoryId) ?? 0,
      });
    }

    return Array.from(byCategory.values()).sort((a, b) => {
      const percentA = a.cap > 0 ? a.spent / a.cap : 0;
      const percentB = b.cap > 0 ? b.spent / b.cap : 0;
      return percentB - percentA;
    });
  }, [budgets, expenseCategories, monthOverrides, spentByCategoryId]);

  const monthBudgetTotal = useMemo(
    () => progressRows.reduce((acc, row) => acc + row.cap, 0),
    [progressRows],
  );

  const monthSpentTotal = useMemo(
    () => progressRows.reduce((acc, row) => acc + row.spent, 0),
    [progressRows],
  );

  const isLoading = categoriesLoading || budgetsLoading || summaryLoading;
  const isError = categoriesError || budgetsError || summaryError;
  const isFetching =
    categoriesFetching || budgetsFetching || summaryFetching;
  const errorMessage =
    categoriesErr instanceof ApiError
      ? categoriesErr.message
      : budgetsErr instanceof ApiError
        ? budgetsErr.message
        : summaryErr instanceof ApiError
          ? summaryErr.message
          : categoriesErr instanceof Error
            ? categoriesErr.message
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
          />

          {isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  void refetchCategories();
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
            <>
              {!isLoading && progressRows.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
                    <p className="text-xs font-bold text-text-muted">
                      ميزانية هذا الشهر
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-primary tabular-nums tracking-tight">
                      {formatMoney(monthBudgetTotal)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
                    <p className="text-xs font-bold text-text-muted">
                      المصروف من الميزانية
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-text-main tabular-nums tracking-tight">
                      {formatMoney(monthSpentTotal)}
                    </p>
                  </div>
                </div>
              )}

              <BudgetSetup
                categories={expenseCategories}
                budgets={budgets}
                month={month}
                isLoading={isLoading}
                amountOverrides={monthOverrides}
                onAmountSaved={(categoryId, amount) => {
                  setAmountOverrides((prev) => ({
                    ...prev,
                    [month]: {
                      ...(prev[month] ?? {}),
                      [categoryId]: amount,
                    },
                  }));
                }}
              />

              <BudgetProgress rows={progressRows} isLoading={isLoading} />

              <BudgetOverallSummary
                totalCap={monthBudgetTotal}
                totalSpent={monthSpentTotal}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
