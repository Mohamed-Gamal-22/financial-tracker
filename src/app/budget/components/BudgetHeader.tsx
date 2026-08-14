import { currentYearMonth } from "@/lib/format";

type BudgetHeaderProps = {
  onOpenSidebar?: () => void;
  month: string;
  onMonthChange: (value: string) => void;
  onAddBudget: () => void;
};

export default function BudgetHeader({
  onOpenSidebar,
  month,
  onMonthChange,
  onAddBudget,
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
            حدد سقفًا شهريًا لكل تصنيف وقارنه بمصروفك الفعلي
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-start">
        <label className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm font-bold text-text-main">
          <span className="text-text-muted font-medium text-xs">الشهر</span>
          <input
            type="month"
            value={month || currentYearMonth()}
            onChange={(event) => onMonthChange(event.target.value)}
            className="bg-transparent text-sm font-bold text-text-main outline-none cursor-pointer"
          />
        </label>

        <button
          type="button"
          onClick={onAddBudget}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-4 py-2.5 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة ميزانية
        </button>
      </div>
    </div>
  );
}
