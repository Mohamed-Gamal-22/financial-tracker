const BARS = [
  { h: "45%", tone: "bg-primary/30" },
  { h: "70%", tone: "bg-primary/50" },
  { h: "55%", tone: "bg-sky/60" },
  { h: "85%", tone: "bg-primary" },
  { h: "40%", tone: "bg-primary/35" },
  { h: "65%", tone: "bg-sky/70" },
  { h: "78%", tone: "bg-primary/80" },
  { h: "50%", tone: "bg-primary/40" },
  { h: "92%", tone: "bg-primary" },
  { h: "60%", tone: "bg-sky/50" },
  { h: "35%", tone: "bg-primary/25" },
  { h: "72%", tone: "bg-primary/70" },
];

export default function SpendingChart() {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-extrabold text-text-main">تحليل الإنفاق</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-primary-tint/40 px-3 py-1.5 text-xs font-bold text-text-main cursor-pointer"
        >
          هذا الشهر
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="h-48 sm:h-56 flex items-end gap-1.5 sm:gap-2 px-1" aria-hidden>
        {BARS.map((bar, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-md ${bar.tone} transition-all`}
            style={{ height: bar.h }}
          />
        ))}
      </div>
    </section>
  );
}
