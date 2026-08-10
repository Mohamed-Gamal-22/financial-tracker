type CategoriesHeaderProps = {
  onOpenSidebar?: () => void;
};

export default function CategoriesHeader({ onOpenSidebar }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            إدارة التصنيفات
          </h1>
          <p className="mt-1 text-sm font-medium text-text-muted max-w-xl">
            تنظيم ومتابعة فئات الدخل والمصروفات الخاصة بك
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-surface px-3.5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-text-muted font-medium">عرض إحصائيات شهر:</span>
          أكتوبر 2023
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-4 py-2.5 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة تصنيف جديد
        </button>
      </div>
    </div>
  );
}
