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
      <td className="px-3 py-3 font-bold text-text-main whitespace-nowrap">
        {budget.month}
      </td>
      <td className="px-3 py-3 tabular-nums text-text-main">
        {formatMoney(budget.expenseAmount)}
      </td>
      <td className="px-3 py-3 tabular-nums text-text-main">
        {formatMoney(budget.actualExpenses)}
      </td>
      <td className="px-3 py-3 tabular-nums text-text-main">
        {formatMoney(budget.remainingExpenseBudget)}
      </td>
      <td className="px-3 py-3 tabular-nums text-sky">
        {formatMoney(budget.savingsAmount)}
      </td>
      <td className="px-3 py-3 tabular-nums text-sky">
        {formatMoney(budget.actualSavings)}
      </td>
      <td className="px-3 py-3 tabular-nums text-sky">
        {formatMoney(budget.remainingSavings)}
      </td>
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

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-text-main">سجل الميزانيات</h2>
        <p className="mt-1 text-xs font-medium text-text-muted">
          كل الشهور مرتبة من الأحدث للأقدم
        </p>
      </div>

      {total && Object.keys(total).length > 0 && (
        <div className="rounded-xl border border-card-border/80 bg-surface/80 px-4 py-3">
          <p className="text-[11px] font-bold text-text-muted mb-2">إجماليات</p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {Object.entries(total).map(([key, value]) => (
              <div key={key}>
                <dt className="text-[11px] font-medium text-text-muted">{key}</dt>
                <dd className="font-extrabold tabular-nums text-text-main">
                  {formatMoney(Number(value) || 0)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-text-muted">
              <th className="px-3 py-2 text-start">الشهر</th>
              <th className="px-3 py-2 text-start">سقف المصروف</th>
              <th className="px-3 py-2 text-start">مصروف فعلي</th>
              <th className="px-3 py-2 text-start">متبقي مصروف</th>
              <th className="px-3 py-2 text-start">ادخار مخطط</th>
              <th className="px-3 py-2 text-start">ادخار فعلي</th>
              <th className="px-3 py-2 text-start">متبقي ادخار</th>
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
