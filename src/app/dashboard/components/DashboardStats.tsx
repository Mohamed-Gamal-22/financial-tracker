"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonthlyBudgetByMonth } from "@/services/api/monthlyBudget";
import { getTransactionSummary } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { formatMoney, sumTotals } from "@/lib/format";

export default function DashboardStats({ month }: { month: string }) {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useQuery({
    queryKey: ["transaction-summary", month],
    queryFn: async () => (await getTransactionSummary(month)).data,
  });

  const {
    data: budget,
    isLoading: budgetLoading,
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

  const isLoading = summaryLoading || budgetLoading;
  const isError = summaryError;

  const income = sumTotals(summary?.income);
  const expense = budget?.actualExpenses ?? sumTotals(summary?.expense);
  const expenseCap = budget?.expenseAmount ?? 0;
  const savingsCap = budget?.savingsAmount ?? 0;
  const savings = budget?.actualSavings ?? sumTotals(summary?.savings);

  /** إيراد − مصروف فعلي − ادخار مسجّل */
  const balance = income - expense - savings;

  const stats = [
    {
      id: "income",
      label: "الإيرادات الشهرية",
      value: formatMoney(income),
      subtitle: null as string | null,
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
      value:
        expenseCap > 0
          ? `${formatMoney(expense)} من ${formatMoney(expenseCap)}`
          : formatMoney(expense),
      subtitle: expenseCap > 0 ? "سقف الميزانية" : "حدّد ميزانية لعرض السقف",
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
      value:
        savingsCap > 0
          ? `${formatMoney(savings)} من ${formatMoney(savingsCap)}`
          : formatMoney(savings),
      subtitle: savingsCap > 0 ? "هدف الادخار في الميزانية" : "حدّد ميزانية لعرض الهدف",
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
      subtitle: "الإيراد − المصروف − الادخار",
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
              {stat.subtitle && !isLoading && !isError && (
                <p className="mt-1.5 text-[11px] font-medium text-text-muted leading-relaxed">
                  {stat.subtitle}
                </p>
              )}
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
