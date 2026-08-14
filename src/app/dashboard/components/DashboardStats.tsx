"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/api/transaction";
import { formatMoney, sumTotals } from "@/lib/format";

export default function DashboardStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: async () => (await getTransactionSummary()).data,
  });

  const income = sumTotals(data?.income);
  const expense = sumTotals(data?.expense);
  const savings = sumTotals(data?.savings);
  /** إيراد − مصروف + ادخار */
  const balance = income - expense + savings;

  const stats = [
    {
      id: "income",
      label: "الإيرادات الشهرية",
      value: formatMoney(income),
      valueClass: "text-accent-success",
      iconBg: "bg-accent-success/10 text-accent-success",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    },
    {
      id: "expenses",
      label: "المصروفات الشهرية",
      value: formatMoney(expense),
      valueClass: "text-accent-danger",
      iconBg: "bg-accent-danger/10 text-accent-danger",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
    },
    {
      id: "savings",
      label: "الادخار الشهري",
      value: formatMoney(savings),
      valueClass: "text-sky",
      iconBg: "bg-sky/15 text-sky",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "balance",
      label: "إجمالي الرصيد",
      value: formatMoney(balance),
      valueClass:
        balance < 0
          ? "text-accent-danger"
          : balance > 0
            ? "text-accent-success"
            : "text-text-main",
      iconBg:
        balance < 0
          ? "bg-accent-danger/10 text-accent-danger"
          : "bg-primary-tint text-primary",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <article
          key={stat.id}
          className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-muted mb-2">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stat.valueClass}`}>
                {isLoading ? "..." : isError ? "—" : stat.value}
              </p>
            </div>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
              {stat.icon}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
