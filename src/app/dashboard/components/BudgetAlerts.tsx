"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBudgets, resolveBudgetCategory } from "@/services/api/budget";
import { getTransactionSummary } from "@/services/api/transaction";
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

export default function BudgetAlerts() {
  const month = currentYearMonth();

  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    isError: budgetsError,
  } = useQuery({
    queryKey: ["budgets", month],
    queryFn: async () => (await getBudgets(month)).data ?? [],
  });

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useQuery({
    queryKey: ["transaction-summary", month],
    queryFn: async () => (await getTransactionSummary(month)).data,
  });

  const spentByCategoryId = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of summary?.expense ?? []) {
      const id = row.category?._id;
      if (!id) continue;
      map.set(id, Number(row.total) || 0);
    }
    return map;
  }, [summary]);

  const alerts = useMemo(() => {
    return budgets
      .map((budget) => {
        const category = resolveBudgetCategory(budget.category);
        const id = category?._id ?? "";
        const spent = id ? (spentByCategoryId.get(id) ?? 0) : 0;
        const cap = Number(budget.amount) || 0;
        if (cap <= 0) return null;
        const percent = Math.round((spent / cap) * 100);
        return {
          id: budget._id,
          title: category?.name ?? "تصنيف",
          spent,
          cap,
          percent,
          status: statusFor(percent),
        };
      })
      .filter((row): row is NonNullable<typeof row> => row != null)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  }, [budgets, spentByCategoryId]);

  const isLoading = budgetsLoading || summaryLoading;
  const isError = budgetsError || summaryError;

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
        <div className="space-y-3">
          <p className="text-sm font-bold text-text-muted">
            لا توجد ميزانيات لهذا الشهر
          </p>
          <Link
            href="/budget"
            className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-bold px-4 py-2 transition-colors"
          >
            إضافة ميزانية
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {alerts.map((alert) => (
            <div key={alert.id}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-bold text-text-main">{alert.title}</p>
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
          ))}
        </div>
      )}
    </section>
  );
}
