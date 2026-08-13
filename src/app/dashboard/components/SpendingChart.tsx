"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/api/transaction";
import { formatMoney, sumTotals } from "@/lib/format";

export default function SpendingChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: async () => (await getTransactionSummary()).data,
  });

  const income = sumTotals(data?.income);
  const expense = sumTotals(data?.expense);
  const savings = sumTotals(data?.savings);
  const max = Math.max(income, expense, savings, 1);

  const bars = [
    {
      label: "دخل",
      value: income,
      h: `${Math.round((income / max) * 100)}%`,
      tone: "bg-accent-success",
    },
    {
      label: "مصروف",
      value: expense,
      h: `${Math.round((expense / max) * 100)}%`,
      tone: "bg-accent-danger",
    },
    {
      label: "ادخار",
      value: savings,
      h: `${Math.round((savings / max) * 100)}%`,
      tone: "bg-sky",
    },
  ];

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-extrabold text-text-main">تحليل الإنفاق</h2>
        <span className="inline-flex items-center rounded-lg border border-card-border bg-primary-tint/40 px-3 py-1.5 text-xs font-bold text-text-main">
          هذا الشهر
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted py-16 text-center">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger py-16 text-center">تعذر تحميل التحليل</p>
      ) : (
        <>
          <div className="h-48 sm:h-56 flex items-end gap-6 px-4" aria-hidden>
            {bars.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <p className="text-xs font-bold text-text-muted">{formatMoney(bar.value)}</p>
                <div
                  className={`w-full max-w-16 rounded-t-xl ${bar.tone} transition-all`}
                  style={{ height: bar.h, minHeight: bar.value > 0 ? "8%" : "2%" }}
                />
                <p className="text-xs font-extrabold text-text-main">{bar.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
