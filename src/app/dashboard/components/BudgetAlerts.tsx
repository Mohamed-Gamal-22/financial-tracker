"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/api/transaction";
import { sumTotals } from "@/lib/format";

export default function BudgetAlerts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: async () => (await getTransactionSummary()).data,
  });

  const expenseTotal = sumTotals(data?.expense);
  const alerts = (data?.expense ?? [])
    .map((row) => {
      const percent =
        expenseTotal > 0 ? Math.round((row.total / expenseTotal) * 100) : 0;
      return {
        id: row.category?._id ?? row.category?.name ?? String(percent),
        title: row.category?.name ?? "تصنيف",
        percent,
      };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <h2 className="text-base font-extrabold text-text-main mb-5">تنبيهات الإنفاق</h2>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger">تعذر تحميل التنبيهات</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm font-bold text-text-muted">لا توجد بيانات إنفاق هذا الشهر</p>
      ) : (
        <div className="space-y-5">
          {alerts.map((alert) => (
            <div key={alert.id}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-bold text-text-main">{alert.title}</p>
                <span className="text-sm font-extrabold text-text-main">{alert.percent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-primary-tint overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${alert.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
