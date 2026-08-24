"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMonthExpenses } from "@/lib/report-transactions";
import { currentYearMonth, formatDateAr, formatMoney } from "@/lib/format";

const COLORS = ["bg-primary", "bg-accent-success", "bg-sky", "bg-purple", "bg-orange-400"];
const TOP_COUNT = 5;

function emptyExpensesMessage(month: string) {
  if (month === currentYearMonth()) {
    return "لا توجد مصروفات هذا الشهر";
  }
  return `لا توجد مصروفات لـ ${month}`;
}

export default function ExpenseCategories({ month }: { month: string }) {
  const { data: expenses = [], isLoading, isError } = useQuery({
    queryKey: ["dashboard-expenses", month],
    queryFn: () => fetchMonthExpenses(month),
  });

  const { expenseTotal, topExpenses } = useMemo(() => {
    const total = expenses.reduce(
      (acc, tx) => acc + (Number(tx.amount) || 0),
      0,
    );
    const sorted = [...expenses].sort(
      (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0),
    );
    return {
      expenseTotal: total,
      topExpenses: sorted.slice(0, TOP_COUNT).map((tx, index) => {
        const amount = Number(tx.amount) || 0;
        const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
        return {
          key: tx._id,
          title: tx.title,
          date: tx.date,
          amount,
          percent: `${percent}%`,
          color: COLORS[index % COLORS.length],
        };
      }),
    };
  }, [expenses]);

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <h2 className="text-base font-extrabold text-text-main mb-5">أكبر المصروفات</h2>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger">تعذر تحميل المصروفات</p>
      ) : topExpenses.length === 0 ? (
        <p className="text-sm font-bold text-text-muted">{emptyExpensesMessage(month)}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-text-muted">
            إجمالي المصروف:{" "}
            <span className="text-accent-danger font-extrabold">
              {formatMoney(expenseTotal)}
            </span>
          </p>
          <ul className="space-y-3">
            {topExpenses.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <span className={`size-3 rounded-full shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-text-main truncate">{item.title}</p>
                    <p className="text-xs font-bold text-text-muted shrink-0">{item.percent}</p>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-primary-tint/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: item.percent }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs font-medium text-text-muted">
                    <span>{formatDateAr(item.date)}</span>
                    <span className="font-extrabold text-accent-danger shrink-0">
                      {formatMoney(item.amount)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
