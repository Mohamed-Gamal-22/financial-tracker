"use client";

export default function BudgetOptionalNotice() {
  return (
    <aside
      role="note"
      className="relative overflow-hidden rounded-2xl border-2 border-primary/35 bg-gradient-to-l from-primary/10 via-sky/10 to-primary-tint/40 shadow-md shadow-primary/10 p-4 sm:p-5 text-start"
    >
      <div className="absolute -top-8 -end-8 h-28 w-28 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 start-1/3 h-24 w-24 rounded-full bg-sky/20 blur-2xl pointer-events-none" />

      <div className="relative flex gap-3 sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-text-inverse shadow-lg shadow-primary/25">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </span>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1 text-[11px] font-extrabold text-text-inverse tracking-wide">
              اختياري
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-text-main">
              الميزانية مش إجبارية
            </h2>
          </div>

          <p className="text-sm font-medium text-text-main/90 leading-relaxed">
            تقدر تسجّل مصروفات وادخار من غير ميزانية، بشرط إن{" "}
            <strong className="font-extrabold text-primary">
              المصروفات + الادخار مايتعدّوش إجمالي الدخل
            </strong>
            .
          </p>

          <p className="text-xs sm:text-sm font-medium text-text-muted leading-relaxed">
            والأفضل تحدد ميزانية عشان تتابع سقف المصروف والادخار التلقائي، وتراجع الأشهر
            السابقة بسهولة لو حابب تشوف تاريخك المالي.
          </p>
        </div>
      </div>
    </aside>
  );
}
