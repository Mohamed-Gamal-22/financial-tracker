"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/api/transaction";
import { currentYearMonth, formatMoney, resolveCategory, sumTotals } from "@/lib/format";

const COLORS = ["bg-primary", "bg-accent-success", "bg-sky", "bg-purple", "bg-orange-400"];

function emptyExpensesMessage(month: string) {
  if (month === currentYearMonth()) {
    return "لا توجد مصروفات هذا الشهر";
  }
  return `لا توجد مصروفات لـ ${month}`;
}

export default function ExpenseCategories({ month }: { month: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transaction-summary", month],
    queryFn: async () => (await getTransactionSummary(month)).data,
  });

  const rows = data?.expense ?? [];
  const expenseTotal = sumTotals(rows);

  const legend = rows.slice(0, 5).map((row, index) => {
    const percent =
      expenseTotal > 0 ? Math.round((row.total / expenseTotal) * 100) : 0;
    const category = resolveCategory(row.category);
    return {
      key: `${category?._id ?? category?.name ?? "row"}-${index}`,
      label: category?.name ?? "—",
      percent: `${percent}%`,
      value: row.total,
      color: COLORS[index % COLORS.length],
    };
  });

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <h2 className="text-base font-extrabold text-text-main mb-5">تصنيف المصاريف</h2>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger">تعذر تحميل الملخص</p>
      ) : legend.length === 0 ? (
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
            {legend.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <span className={`size-3 rounded-full shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-text-main truncate">{item.label}</p>
                    <p className="text-xs font-bold text-text-muted shrink-0">{item.percent}</p>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-primary-tint/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: item.percent }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    {formatMoney(item.value)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
