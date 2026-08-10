const FILTERS = [
  { id: "all", label: "الكل", active: true },
  { id: "income", label: "الدخل", active: false },
  { id: "expense", label: "المصاريف", active: false },
] as const;

export default function TransactionsToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-card-border bg-surface/90 backdrop-blur-sm px-3 sm:px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={[
              "rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer",
              filter.active
                ? "bg-primary text-text-inverse shadow-sm shadow-primary/20"
                : "border border-card-border bg-surface text-text-main hover:bg-primary-tint/50 hover:text-primary",
            ].join(" ")}
          >
            {filter.label}
          </button>
        ))}

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-surface px-4 py-2 text-sm font-bold text-text-main hover:bg-primary-tint/50 transition-colors cursor-pointer"
        >
          الفئة
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-surface px-4 py-2 text-sm font-bold text-text-main hover:bg-primary-tint/50 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          الشهر
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="relative w-full lg:w-64">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="بحث..."
          readOnly
          className="w-full bg-input-bg border border-input-border rounded-full ps-10 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none focus:border-input-focus focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
