"use client";

import { useRef } from "react";
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
  const monthInputRef = useRef<HTMLInputElement>(null);

  function openMonthPicker() {
    const input = monthInputRef.current;
    if (!input) return;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Some browsers throw if showPicker isn't allowed; fall through to focus.
    }
    input.focus();
    input.click();
  }

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
            حدد سقفًا لكل تصنيف مصروف، ثم تابع نسبة الاستهلاك تحت
          </p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={openMonthPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMonthPicker();
          }
        }}
        className="inline-flex items-center gap-2 self-start rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer select-none"
      >
        <span className="text-text-muted font-medium text-xs pointer-events-none">
          الشهر
        </span>
        <input
          ref={monthInputRef}
          type="month"
          value={month || currentYearMonth()}
          onChange={(event) => onMonthChange(event.target.value)}
          onClick={(event) => {
            event.stopPropagation();
            openMonthPicker();
          }}
          className="bg-transparent text-sm font-bold text-text-main outline-none cursor-pointer min-w-[9.5rem]"
          aria-label="اختيار شهر الميزانية"
        />
      </div>
    </div>
  );
}
