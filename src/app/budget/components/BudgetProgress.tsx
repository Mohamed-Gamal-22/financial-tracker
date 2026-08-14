"use client";

import { formatMoney } from "@/lib/format";

export type BudgetProgressRow = {
  id: string;
  name: string;
  cap: number;
  spent: number;
};

type BudgetProgressProps = {
  rows: BudgetProgressRow[];
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

export default function BudgetProgress({ rows, isLoading }: BudgetProgressProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل النسب...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-5">
      <div>
        <h2 className="text-base font-extrabold text-text-main">نسب استهلاك الميزانية</h2>
        <p className="mt-1 text-xs font-medium text-text-muted">
          نسبة ما اتصرف من سقف كل تصنيف مصروف في الشهر المحدد
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm font-bold text-text-muted py-4 text-center">
          احفظ ميزانية لتصنيف واحد على الأقل لعرض النسب هنا
        </p>
      ) : (
        <div className="space-y-5">
          {rows.map((row) => {
            const percent =
              row.cap > 0 ? Math.round((row.spent / row.cap) * 100) : 0;
            const barWidth = Math.min(percent, 100);
            const status = statusFor(percent);

            return (
              <div key={row.id} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-text-main truncate">
                      {row.name}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-text-muted">
                      {formatMoney(row.spent)} من {formatMoney(row.cap)}
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
            );
          })}
        </div>
      )}
    </section>
  );
}
