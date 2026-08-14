"use client";

import { formatMoney } from "@/lib/format";

type BudgetOverallSummaryProps = {
  totalCap: number;
  totalSpent: number;
  isLoading?: boolean;
};

function overallStatus(percent: number, remaining: number) {
  if (totalExceeded(percent)) {
    return {
      bar: "bg-accent-danger",
      badge: "bg-accent-danger/15 text-accent-danger",
      title: "تم تجاوز الحد الأقصى الإجمالي",
      hint: "إجمالي مصروفاتك عدّى مجموع أسقف الميزانية لهذا الشهر",
      tone: "text-accent-danger",
      card: "border-accent-danger/30 bg-accent-danger/5",
    };
  }
  if (percent >= 80) {
    return {
      bar: "bg-orange-400",
      badge: "bg-orange-100 text-orange-600",
      title: "اقتراب من الحد الأقصى الإجمالي",
      hint: `متبقي تقريبًا ${formatMoney(Math.max(remaining, 0))} قبل الوصول للسقف الكلي`,
      tone: "text-orange-600",
      card: "border-orange-200 bg-orange-50/80",
    };
  }
  return {
    bar: "bg-accent-success",
    badge: "bg-accent-success/15 text-accent-success",
    title: "ضمن الحد الأقصى الإجمالي",
    hint: `لسه فاضل ${formatMoney(Math.max(remaining, 0))} من إجمالي الميزانية`,
    tone: "text-accent-success",
    card: "border-accent-success/25 bg-accent-success/5",
  };
}

function totalExceeded(percent: number) {
  return percent >= 100;
}

export default function BudgetOverallSummary({
  totalCap,
  totalSpent,
  isLoading,
}: BudgetOverallSummaryProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري حساب الإجمالي...</p>
      </section>
    );
  }

  if (totalCap <= 0) {
    return (
      <section className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-6 text-center">
        <h2 className="text-base font-extrabold text-text-main">المعيار الإجمالي للشهر</h2>
        <p className="mt-2 text-sm font-bold text-text-muted">
          احفظ ميزانية لتصنيف واحد على الأقل لمعرفة هل عدّيت الحد الأقصى ككل
        </p>
      </section>
    );
  }

  const percent = Math.round((totalSpent / totalCap) * 100);
  const remaining = totalCap - totalSpent;
  const overBy = totalSpent - totalCap;
  const status = overallStatus(percent, remaining);
  const barWidth = Math.min(Math.max(percent, 0), 100);

  return (
    <section
      className={`rounded-2xl border shadow-sm p-5 sm:p-6 text-start space-y-5 ${status.card}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-extrabold text-text-main">
            المعيار الإجمالي للشهر
          </h2>
          <p className="mt-1 text-xs font-medium text-text-muted leading-relaxed max-w-xl">
            هنا بنقارن مجموع كل المصروفات بمجموع كل أسقف الميزانية. لو زدت في تصنيف
            وقلّلت في تاني، الإجمالي هو اللي بيحدد هل عدّيت الحد الأقصى ولا لأ.
          </p>
        </div>
        <span
          className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold ${status.badge}`}
        >
          {status.title}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-card-border/70 bg-surface/90 p-4">
          <p className="text-[11px] font-bold text-text-muted">إجمالي السقف</p>
          <p className="mt-1 text-lg font-extrabold text-primary tabular-nums">
            {formatMoney(totalCap)}
          </p>
        </div>
        <div className="rounded-xl border border-card-border/70 bg-surface/90 p-4">
          <p className="text-[11px] font-bold text-text-muted">إجمالي المصروف</p>
          <p className="mt-1 text-lg font-extrabold text-text-main tabular-nums">
            {formatMoney(totalSpent)}
          </p>
        </div>
        <div className="rounded-xl border border-card-border/70 bg-surface/90 p-4">
          <p className="text-[11px] font-bold text-text-muted">
            {overBy > 0 ? "التجاوز" : "المتبقي"}
          </p>
          <p className={`mt-1 text-lg font-extrabold tabular-nums ${status.tone}`}>
            {formatMoney(Math.abs(overBy > 0 ? overBy : remaining))}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-text-muted">نسبة الاستهلاك الكلي</span>
          <span className={`text-sm font-extrabold tabular-nums ${status.tone}`}>
            {percent}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-surface overflow-hidden border border-card-border/50">
          <div
            className={`h-full rounded-full transition-all ${status.bar}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className={`text-xs font-bold ${status.tone}`}>{status.hint}</p>
      </div>
    </section>
  );
}
