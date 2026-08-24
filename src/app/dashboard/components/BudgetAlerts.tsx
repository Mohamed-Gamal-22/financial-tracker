"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMonthlyBudgetByMonth } from "@/services/api/monthlyBudget";
import { currentYearMonth, formatMoney } from "@/lib/format";

function expenseStatusFor(percent: number) {
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

function savingsStatusFor(percent: number) {
  if (percent >= 100) {
    return {
      bar: "bg-accent-success",
      label: "تم تحقيق الهدف",
      tone: "text-accent-success",
    };
  }
  if (percent >= 80) {
    return {
      bar: "bg-sky",
      label: "اقتراب من الهدف",
      tone: "text-sky",
    };
  }
  return {
    bar: "bg-sky/70",
    label: "ضمن الهدف",
    tone: "text-text-muted",
  };
}

type ProgressAlert = {
  title: string;
  spent: number;
  cap: number;
  percent: number;
  status: ReturnType<typeof expenseStatusFor>;
  trackClass: string;
};

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

  const alerts = useMemo((): ProgressAlert[] => {
    if (!budget) return [];

    const items: ProgressAlert[] = [];

    if (budget.expenseAmount > 0) {
      const percent = Math.round(
        (budget.actualExpenses / budget.expenseAmount) * 100,
      );
      items.push({
        title: "ميزانية المصروف الشهري",
        spent: budget.actualExpenses,
        cap: budget.expenseAmount,
        percent,
        status: expenseStatusFor(percent),
        trackClass: "bg-primary-tint",
      });
    }

    if (budget.savingsAmount > 0) {
      const percent = Math.round(
        (budget.actualSavings / budget.savingsAmount) * 100,
      );
      items.push({
        title: "هدف الادخار الشهري",
        spent: budget.actualSavings,
        cap: budget.savingsAmount,
        percent,
        status: savingsStatusFor(percent),
        trackClass: "bg-sky/15",
      });
    }

    return items;
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
      ) : alerts.length === 0 ? (
        <p className="text-sm font-bold text-text-muted">
          {emptyBudgetsMessage(month)}
        </p>
      ) : (
        <div className="space-y-5">
          {alerts.map((alert) => (
            <div key={alert.title}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-bold text-text-main">{alert.title}</p>
                <span className={`text-sm font-extrabold tabular-nums ${alert.status.tone}`}>
                  {alert.percent}%
                </span>
              </div>
              <p className="text-[11px] font-medium text-text-muted mb-2">
                {formatMoney(alert.spent)} من {formatMoney(alert.cap)} —{" "}
                {alert.status.label}
              </p>
              <div className={`h-2.5 rounded-full overflow-hidden ${alert.trackClass}`}>
                <div
                  className={`h-full rounded-full ${alert.status.bar}`}
                  style={{ width: `${Math.min(alert.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
