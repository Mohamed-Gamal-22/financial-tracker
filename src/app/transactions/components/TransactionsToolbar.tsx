"use client";

import type { CategoryType } from "@/schemas/category.schema";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";

export type CategoryTypeFilter = "all" | CategoryType;

type TransactionsToolbarProps = {
  categoryType: CategoryTypeFilter;
  onCategoryTypeChange: (value: CategoryTypeFilter) => void;
  categoryName: string;
  onCategoryNameChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
};

const TYPE_FILTERS: { id: CategoryTypeFilter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "income", label: CATEGORY_TYPE_LABELS.income },
  { id: "expense", label: CATEGORY_TYPE_LABELS.expense },
  { id: "savings", label: CATEGORY_TYPE_LABELS.savings },
];

export default function TransactionsToolbar({
  categoryType,
  onCategoryTypeChange,
  categoryName,
  onCategoryNameChange,
  month,
  onMonthChange,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-card-border bg-surface/90 backdrop-blur-sm px-3 sm:px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((filter) => {
          const active = categoryType === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onCategoryTypeChange(filter.id)}
              className={[
                "rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer",
                active
                  ? "bg-primary text-text-inverse shadow-sm shadow-primary/20"
                  : "border border-card-border bg-surface text-text-main hover:bg-primary-tint/50 hover:text-primary",
              ].join(" ")}
            >
              {filter.label}
            </button>
          );
        })}

        <label className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-surface px-3 py-1.5 text-sm font-bold text-text-main">
          <span className="text-text-muted font-medium text-xs">الشهر</span>
          <input
            type="month"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className="bg-transparent text-sm font-bold text-text-main outline-none cursor-pointer"
          />
          {month && (
            <button
              type="button"
              onClick={() => onMonthChange("")}
              className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer"
            >
              مسح
            </button>
          )}
        </label>
      </div>

      <div className="relative w-full lg:w-64">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <input
          type="search"
          value={categoryName}
          onChange={(event) => onCategoryNameChange(event.target.value)}
          placeholder="بحث باسم التصنيف..."
          className="w-full bg-input-bg border border-input-border rounded-full ps-10 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none focus:border-input-focus focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
