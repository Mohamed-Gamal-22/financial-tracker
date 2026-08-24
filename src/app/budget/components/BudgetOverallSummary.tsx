"use client";

import { formatMoney } from "@/lib/format";
import type { MonthlyBudget } from "@/schemas/monthlyBudget.schema";

type BudgetOverallSummaryProps = {
  budget: MonthlyBudget | null | undefined;
  totalIncome: number;
  isLoading?: boolean;
};

type SummaryItem = {
  label: string;
  value: number;
  tone: string;
};

function SummaryRow({
  items,
  columns = 3,
}: {
  items: SummaryItem[];
  columns?: 1 | 3;
}) {
  return (
    <dl
      className={[
        "grid gap-3",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3",
      ].join(" ")}
    >
      {items.map((row) => (
        <div
          key={row.label}
          className="rounded-xl border border-card-border/80 bg-surface/80 px-4 py-3"
        >
          <dt className="text-[11px] font-bold text-text-muted">{row.label}</dt>
          <dd className={`mt-1 text-lg font-extrabold tabular-nums ${row.tone}`}>
            {formatMoney(row.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function BudgetOverallSummary({
  budget,
  totalIncome,
  isLoading,
}: BudgetOverallSummaryProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل الملخص...</p>
      </section>
    );
  }

  if (!budget) {
    return (
      <section className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-6 text-center">
        <p className="text-sm font-bold text-text-muted">
          {totalIncome > 0
            ? "لم تُحدّد ميزانية بعد — يمكنك إضافة مصروفات ضمن حدود الدخل"
            : "ابدأ بتسجيل دخل الشهر"}
        </p>
      </section>
    );
  }

  const incomeRow: SummaryItem[] = [
    { label: "إجمالي الدخل", value: totalIncome, tone: "text-accent-success" },
  ];

  const expenseRows: SummaryItem[] = [
    {
      label: "سقف المصروف",
      value: budget.expenseAmount,
      tone: "text-primary",
    },
    {
      label: "المصروف الفعلي",
      value: budget.actualExpenses,
      tone: "text-text-main",
    },
    {
      label: "المتبقي للمصروف",
      value: budget.remainingExpenseBudget,
      tone: "text-text-main",
    },
  ];

  const savingsRows: SummaryItem[] = [
    {
      label: "إجمالي الادخار",
      value: budget.savingsAmount,
      tone: "text-sky",
    },
    {
      label: "الادخار الفعلي",
      value: budget.actualSavings,
      tone: "text-sky",
    },
    {
      label: "المتبقي للادخار",
      value: budget.remainingSavings,
      tone: "text-sky",
    },
  ];

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start">
      <h2 className="text-base font-extrabold text-text-main mb-4">ملخص الشهر</h2>
      <div className="space-y-4">
        <SummaryRow items={incomeRow} columns={1} />
        <SummaryRow items={expenseRows} columns={3} />
        <SummaryRow items={savingsRows} columns={3} />
      </div>
    </section>
  );
}
