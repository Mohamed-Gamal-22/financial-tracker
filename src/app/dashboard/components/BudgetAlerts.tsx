"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMonthlyBudgetByMonth } from "@/services/api/monthlyBudget";
import { currentYearMonth, formatMoney } from "@/lib/format";

function statusFor(percent: number) {
  if (percent >= 100) {
    return {
      bar: "bg-accent-danger",
      label: "تم تجاوز السقف",
      tone: "text-accent-danger",
    };
  }
  if (percent >= 80) {
    return {
      bar: "bg-orange-400",
      label: "اقتراب من السقف",
      tone: "text-orange-600",
    };
  }
  return {
    bar: "bg-primary",
    label: "ضمن السقف",
    tone: "text-text-muted",
  };
}

function emptyBudgetsMessage(month: string) {
  if (month === currentYearMonth()) {
    return "لا توجد ميزانية لهذا الشهر";
  }
  return `لا توجد ميزانية لـ ${month}`;
}

export default function BudgetAlerts({ month }: { month: string }) {
  const {
    data: budget,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monthly-budget", month],
    queryFn: async () => (await getMonthlyBudgetByMonth(month)).data ?? null,
  });

  const alert = useMemo(() => {
    if (!budget || budget.expenseAmount <= 0) return null;

    const spent = budget.actualExpenses;
    const cap = budget.expenseAmount;
    const percent = Math.round((spent / cap) * 100);

    return {
      spent,
      cap,
      percent,
      status: statusFor(percent),
    };
  }, [budget]);

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-extrabold text-text-main">تنبيهات الميزانية</h2>
        <Link
          href="/budget"
          className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
        >
          إدارة الميزانية
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger">تعذر تحميل التنبيهات</p>
      ) : !alert ? (
        <p className="text-sm font-bold text-text-muted">
          {emptyBudgetsMessage(month)}
        </p>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-bold text-text-main">ميزانية المصروف الشهري</p>
              <span className={`text-sm font-extrabold ${alert.status.tone}`}>
                {alert.percent}%
              </span>
            </div>
            <p className="text-[11px] font-medium text-text-muted mb-2">
              {formatMoney(alert.spent)} من {formatMoney(alert.cap)} — {alert.status.label}
            </p>
            <div className="h-2.5 rounded-full bg-primary-tint overflow-hidden">
              <div
                className={`h-full rounded-full ${alert.status.bar}`}
                style={{ width: `${Math.min(alert.percent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
