const STATS = [
  {
    id: "balance",
    label: "إجمالي الرصيد",
    value: "14,200.00",
    currency: "ج.م",
    valueClass: "text-text-main",
    badge: "12.4% ↑",
    iconBg: "bg-primary-tint text-primary",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: "income",
    label: "الإيرادات الشهرية",
    value: "8,500.00",
    currency: "ج.م",
    valueClass: "text-accent-success",
    iconBg: "bg-accent-success/10 text-accent-success",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    id: "expenses",
    label: "المصروفات الشهرية",
    value: "4,250.00",
    currency: "ج.م",
    valueClass: "text-accent-danger",
    iconBg: "bg-accent-danger/10 text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
  },
];

export default function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {STATS.map((stat) => (
        <article
          key={stat.id}
          className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-muted mb-2">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stat.valueClass}`}>
                {stat.value}{" "}
                <span className="text-sm font-bold text-text-muted">{stat.currency}</span>
              </p>
            </div>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
              {stat.icon}
            </span>
          </div>
          {"badge" in stat && stat.badge && (
            <span className="mt-3 inline-flex items-center rounded-full bg-accent-success/15 text-accent-success text-[11px] font-extrabold px-2 py-0.5">
              {stat.badge}
            </span>
          )}
        </article>
      ))}
    </section>
  );
}
