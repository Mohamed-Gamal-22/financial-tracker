"use client";

import MonthPickerField from "@/components/date/MonthPickerField";
import { yearMonthFromPeriod } from "@/lib/date-value";
import { currentYearMonth } from "@/lib/format";

type BudgetHeaderProps = {
  onOpenSidebar?: () => void;
  month: string;
  onMonthChange: (value: string) => void;
};

export default function BudgetHeader({
  onOpenSidebar,
  month,
  onMonthChange,
}: BudgetHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 text-start">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="فتح القائمة"
            className="lg:hidden mt-1 p-2 rounded-xl border border-card-border/60 bg-surface hover:bg-primary-tint/40 text-text-main transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
            الميزانية
          </h1>
          <p className="mt-1 text-sm font-medium text-text-muted">
            حدّد سقف مصروفات الشهر وتابع الاستهلاك والادخار
          </p>
        </div>
      </div>

      <MonthPickerField
        compact
        monthOnly
        compactLabel="الشهر"
        value={month || currentYearMonth()}
        onChange={(value) =>
          onMonthChange(yearMonthFromPeriod(value) || value)
        }
        placeholder="اختر الشهر"
        className="self-start"
      />
    </div>
  );
}
