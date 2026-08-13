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
            التصنيفات
          </h1>
          <p className="mt-1 text-sm font-medium text-text-muted max-w-xl">
            تصفح تصنيفات الدخل والمصروفات والادخار المتاحة لحسابك
          </p>
        </div>
      </div>
    </div>
  );
}
