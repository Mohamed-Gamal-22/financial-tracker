"use client";

import { formatMoney } from "@/lib/format";

type BudgetProgressProps = {
  expenseCap: number;
  actualExpenses: number;
  isLoading?: boolean;
};

function statusFor(percent: number) {
  if (percent >= 100) {
    return {
      bar: "bg-accent-danger",
      badge: "bg-accent-danger/15 text-accent-danger",
      label: "تم تجاوز السقف",
      tone: "text-accent-danger",
    };
  }
  if (percent >= 80) {
    return {
      bar: "bg-orange-400",
      badge: "bg-orange-100 text-orange-600",
      label: "اقتراب من السقف",
      tone: "text-orange-600",
    };
  }
  return {
    bar: "bg-primary",
    badge: "bg-primary-tint text-primary",
    label: "ضمن السقف",
    tone: "text-text-main",
  };
}

export default function BudgetProgress({
  expenseCap,
  actualExpenses,
  isLoading,
}: BudgetProgressProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل النسب...</p>
      </section>
    );
  }

  if (expenseCap <= 0) {
    return (
      <section className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-6 sm:p-8 text-start space-y-2">
        <p className="text-sm font-extrabold text-text-main">
          لا توجد ميزانية لهذا الشهر — وده اختياري
        </p>
        <p className="text-xs font-medium text-text-muted leading-relaxed">
          تقدر تكمل تسجيل مصروفات وادخار بشرط إن المصروفات + الادخار مايتعدّوش إجمالي الدخل.
          لما تحدد ميزانية هتقدر تتابع نسبة الاستهلاك من السقف وتراجعها لاحقًا في سجل الميزانيات.
        </p>
      </section>
    );
  }

  const percent =
    expenseCap > 0 ? Math.round((actualExpenses / expenseCap) * 100) : 0;
  const barWidth = Math.min(percent, 100);
  const status = statusFor(percent);

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-5">
      <div>
        <h2 className="text-base font-extrabold text-text-main">
          نسبة استهلاك ميزانية المصروف
        </h2>
        <p className="mt-1 text-xs font-medium text-text-muted">
          تنبيهات السيرفر تُرسل عند تجاوز 80% من سقف المصروف الشهري
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-text-main">المصروف الشهري</p>
            <p className="mt-0.5 text-[11px] font-medium text-text-muted">
              {formatMoney(actualExpenses)} من {formatMoney(expenseCap)}
            </p>
          </div>
          <div className="shrink-0 text-end space-y-1">
            <p className={`text-sm font-extrabold tabular-nums ${status.tone}`}>
              {percent}%
            </p>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${status.badge}`}
            >
              {status.label}
            </span>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-primary-tint overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${status.bar}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </section>
  );
}
