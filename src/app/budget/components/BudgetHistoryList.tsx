"use client";

import { useQuery } from "@tanstack/react-query";
import { listMonthlyBudgets } from "@/services/api/monthlyBudget";
import { ApiError } from "@/services/api/types";
import { formatMoney } from "@/lib/format";
import type { MonthlyBudget } from "@/schemas/monthlyBudget.schema";

type BudgetHistoryListProps = {
  activeMonth?: string;
  onSelectMonth?: (month: string) => void;
};

/** Derived: الدخل = سقف المصروف + إجمالي الادخار (نفس منطق الميزانية). */
function budgetTotalIncome(budget: MonthlyBudget): number {
  return budget.expenseAmount + budget.savingsAmount;
}

const TOTAL_FIELD_LABELS: Record<string, string> = {
  expenseAmount: "سقف المصروف",
  actualExpenses: "المصروف الفعلي",
  remainingExpenseBudget: "المتبقي للمصروف",
  savingsAmount: "إجمالي الادخار",
  actualSavings: "الادخار الفعلي",
  remainingSavings: "المتبقي للادخار",
  totalIncome: "إجمالي الدخل",
  income: "إجمالي الدخل",
};

/** Monetary fields only — excludes `budgets` / `count` (record counts, not money). */
const MONETARY_TOTAL_KEYS = [
  "expenseAmount",
  "savingsAmount",
  "actualExpenses",
  "remainingExpenseBudget",
  "actualSavings",
  "remainingSavings",
] as const;

type MonetaryTotalKey = (typeof MONETARY_TOTAL_KEYS)[number];

function sumBudgetsAcrossMonths(budgets: MonthlyBudget[]) {
  const sums: Record<MonetaryTotalKey, number> = {
    expenseAmount: 0,
    savingsAmount: 0,
    actualExpenses: 0,
    remainingExpenseBudget: 0,
    actualSavings: 0,
    remainingSavings: 0,
  };

  let totalIncome = 0;

  for (const budget of budgets) {
    totalIncome += budgetTotalIncome(budget);
    for (const key of MONETARY_TOTAL_KEYS) {
      sums[key] += budget[key];
    }
  }

  const entries: { key: string; label: string; value: number }[] = [
    {
      key: "totalIncome",
      label: TOTAL_FIELD_LABELS.totalIncome,
      value: totalIncome,
    },
  ];

  for (const key of MONETARY_TOTAL_KEYS) {
    entries.push({
      key,
      label: TOTAL_FIELD_LABELS[key],
      value: sums[key],
    });
  }

  return entries;
}

const TABLE_COLUMNS = [
  { key: "month", label: "الشهر", tone: "text-text-main" },
  { key: "totalIncome", label: "إجمالي الدخل", tone: "text-accent-success" },
  { key: "expenseAmount", label: "سقف المصروف", tone: "text-primary" },
  { key: "savingsAmount", label: "إجمالي الادخار", tone: "text-sky" },
  { key: "actualExpenses", label: "المصروف الفعلي", tone: "text-text-main" },
  {
    key: "remainingExpenseBudget",
    label: "المتبقي للمصروف",
    tone: "text-text-main",
  },
  { key: "actualSavings", label: "الادخار الفعلي", tone: "text-sky" },
  { key: "remainingSavings", label: "المتبقي للادخار", tone: "text-sky" },
] as const;

function formatCellValue(budget: MonthlyBudget, key: (typeof TABLE_COLUMNS)[number]["key"]) {
  if (key === "month") return budget.month;
  if (key === "totalIncome") return formatMoney(budgetTotalIncome(budget));
  return formatMoney(budget[key]);
}

function BudgetRow({
  budget,
  active,
  onSelect,
}: {
  budget: MonthlyBudget;
  active: boolean;
  onSelect?: (month: string) => void;
}) {
  return (
    <tr
      className={[
        "border-t border-card-border/70 text-sm",
        onSelect ? "cursor-pointer transition-colors" : "",
        active ? "bg-primary-tint/40" : onSelect ? "hover:bg-primary-tint/20" : "",
      ].join(" ")}
      onClick={onSelect ? () => onSelect(budget.month) : undefined}
    >
      {TABLE_COLUMNS.map((column) => (
        <td
          key={column.key}
          className={[
            "px-3 py-3 tabular-nums whitespace-nowrap",
            column.key === "month" ? "font-bold" : "",
            column.tone,
          ].join(" ")}
        >
          {formatCellValue(budget, column.key)}
        </td>
      ))}
    </tr>
  );
}

export default function BudgetHistoryList({
  activeMonth,
  onSelectMonth,
}: BudgetHistoryListProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["monthly-budget-list"],
    queryFn: async () => (await listMonthlyBudgets()).data,
  });

  const budgets = data?.budgets ?? [];
  const total = data?.total;

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل سجل الميزانيات...</p>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "تعذر تحميل سجل الميزانيات";
    return (
      <section className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-6 text-center space-y-3">
        <p className="text-sm font-bold text-accent-danger">{message}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 disabled:opacity-60 cursor-pointer"
        >
          {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
        </button>
      </section>
    );
  }

  if (budgets.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-6 text-center">
        <p className="text-sm font-bold text-text-muted">لا توجد ميزانيات مسجّلة بعد</p>
      </section>
    );
  }

  const budgetCount = Number(total?.budgets) || budgets.length;
  const totalEntries = sumBudgetsAcrossMonths(budgets);

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-text-main">سجل الميزانيات</h2>
        <p className="mt-1 text-xs font-medium text-text-muted">
          {budgetCount > 0
            ? `${budgetCount.toLocaleString("ar-EG")} ${budgetCount === 1 ? "ميزانية" : "ميزانيات"} — مرتبة من الأحدث للأقدم`
            : "كل الشهور مرتبة من الأحدث للأقدم"}
        </p>
      </div>

      <div className="rounded-xl border border-card-border/80 bg-surface/80 px-4 py-3">
        <p className="text-[11px] font-bold text-text-muted mb-2">
          إجماليات كل الشهور
        </p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {totalEntries.map(({ key, label, value }) => (
            <div key={key}>
              <dt className="text-[11px] font-medium text-text-muted">{label}</dt>
              <dd className="font-extrabold tabular-nums text-text-main">
                {formatMoney(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-text-muted">
              {TABLE_COLUMNS.map((column) => (
                <th key={column.key} className="px-3 py-2 text-start whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <BudgetRow
                key={budget._id}
                budget={budget}
                active={budget.month === activeMonth}
                onSelect={onSelectMonth}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
