"use client";

import type { Budget } from "@/schemas/budget.schema";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";
import { resolveBudgetCategory } from "@/services/api/budget";
import { formatMoney } from "@/lib/format";

export type BudgetCompareRow = {
  budget: Budget;
  spent: number;
};

type BudgetListProps = {
  rows: BudgetCompareRow[];
  isLoading?: boolean;
};

function statusFor(percent: number) {
  if (percent >= 100) {
    return {
      bar: "bg-accent-danger",
      badge: "bg-accent-danger/15 text-accent-danger",
      label: "تم تجاوز السقف",
    };
  }
  if (percent >= 80) {
    return {
      bar: "bg-orange-400",
      badge: "bg-orange-100 text-orange-600",
      label: "اقتراب من السقف",
    };
  }
  return {
    bar: "bg-primary",
    badge: "bg-primary-tint text-primary",
    label: "ضمن السقف",
  };
}

export default function BudgetList({ rows, isLoading }: BudgetListProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-card-border bg-surface/90 p-10 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل الميزانيات...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-10 text-center space-y-2">
        <p className="text-sm font-bold text-text-muted">لا توجد ميزانيات لهذا الشهر</p>
        <p className="text-xs font-medium text-text-muted">
          أضف ميزانية لتصنيف مصروف لبدء المتابعة
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rows.map(({ budget, spent }) => {
        const category = resolveBudgetCategory(budget.category);
        const cap = Number(budget.amount) || 0;
        const percent = cap > 0 ? Math.round((spent / cap) * 100) : 0;
        const barWidth = Math.min(percent, 100);
        const status = statusFor(percent);
        const type = category?.type;

        return (
          <article
            key={budget._id}
            className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-text-main truncate">
                  {category?.name ?? "—"}
                </h3>
                {type && (
                  <p className="mt-1 text-xs font-bold text-text-muted">
                    {CATEGORY_TYPE_LABELS[type]}
                  </p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.badge}`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-bold text-text-muted">المصروف</span>
              <span className="font-extrabold text-text-main">
                {formatMoney(spent)} / {formatMoney(cap)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-text-muted">نسبة الاستهلاك</span>
                <span className="text-xs font-extrabold text-text-main">{percent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-primary-tint overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${status.bar}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              disabled
              title="تعديل الميزانية غير متاح بعد"
              className="w-full rounded-xl border border-card-border bg-surface px-4 py-2 text-xs font-bold text-text-muted opacity-60 cursor-not-allowed"
            >
              تعديل (قريبًا)
            </button>
          </article>
        );
      })}
    </div>
  );
}
