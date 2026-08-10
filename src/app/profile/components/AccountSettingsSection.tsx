const SETTINGS = [
  {
    id: "currency",
    label: "العملة الأساسية",
    value: "جنيه مصري (EGP)",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "language",
    label: "لغة العرض",
    value: "العربية",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
];

export default function AccountSettingsSection() {
  return (
    <section className="text-start">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </span>
        <h3 className="text-base font-extrabold text-text-main">إعدادات الحساب</h3>
      </div>

      <div className="rounded-2xl border border-card-border bg-primary-tint/40 divide-y divide-card-border/70 overflow-hidden">
        {SETTINGS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary border border-card-border/60">
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-main">{item.label}</p>
              <p className="text-xs font-medium text-text-muted mt-0.5 truncate">{item.value}</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-sm font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              تغيير
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
