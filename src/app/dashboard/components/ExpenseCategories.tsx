const LEGEND = [
  { label: "الفواتير", percent: "55%", color: "bg-primary" },
  { label: "مصاريف شخصية", percent: "30%", color: "bg-accent-success" },
  { label: "النقدية", percent: "15%", color: "bg-sky" },
];

export default function ExpenseCategories() {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <h2 className="text-base font-extrabold text-text-main mb-5">تصنيف المصاريف</h2>

      <div className="flex flex-col items-center gap-5">
        <div className="relative size-40 sm:size-44">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--primary-tint)" strokeWidth="5" />
            {/* 55% bills */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="5"
              strokeDasharray="55 45"
              strokeDashoffset="0"
              strokeLinecap="butt"
            />
            {/* 30% personal — starts after 55 */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="var(--accent-success)"
              strokeWidth="5"
              strokeDasharray="30 70"
              strokeDashoffset="-55"
              strokeLinecap="butt"
            />
            {/* 15% cash */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="var(--sky)"
              strokeWidth="5"
              strokeDasharray="15 85"
              strokeDashoffset="-85"
              strokeLinecap="butt"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
            <span className="text-[11px] font-bold text-text-muted">الإجمالي</span>
            <span className="text-xl font-extrabold text-text-main">4.2K</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              <span className={`size-2.5 rounded-full shrink-0 ${item.color}`} />
              <span className="font-medium text-text-muted flex-1">{item.label}</span>
              <span className="font-extrabold text-text-main">{item.percent}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
