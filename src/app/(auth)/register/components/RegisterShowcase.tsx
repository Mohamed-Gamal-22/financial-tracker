import React from "react";

export default function RegisterShowcase() {
  return (
    <section className="flex-1 hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden bg-gradient-to-tr from-primary/5 via-transparent to-accent-info/5 select-none">
      {/* تأثير الإضاءة الخلفية */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* خطوط الخلفية التقنية */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* الحاوية المركزية للوحة التحكم الوهمية */}
      <div className="relative w-full max-w-[500px] h-[400px]">
        {/* كارت 1: هدف الادخار الشهري (طافي بمسار 1) */}
        <div className="absolute top-16 start-[-30px] w-[380px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-one text-start">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                هدف الادخار الشهري
              </span>
              <span className="text-2xl font-extrabold text-text-main tracking-tight font-sans mt-1 block">
                تم توفير 3,800 من 5,000 جنية
              </span>
            </div>
            <div className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary flex items-center gap-1 shrink-0">
              <span>76%</span>
            </div>
          </div>

          <p className="text-xs text-text-muted font-medium mb-4">أنت على بعد خطوات بسيطة من تحقيق هدفك لهذا الشهر!</p>

          {/* شريط التقدم التفاعلي */}
          <div className="w-full bg-card-border/50 h-3.5 rounded-full overflow-hidden relative p-[2px] border border-card-border">
            <div className="bg-gradient-to-r from-primary to-primary-hover h-full rounded-full w-[76%] shadow-lg shadow-primary/20" />
          </div>
        </div>

        {/* كارت 2: مصادر الدخل (طافي بمسار 2) */}
        <div className="absolute top-2 end-[-120px] w-[280px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-two z-20 text-start">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3.5">
            مصادر الدخل الواردة
          </span>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-success/10 border border-accent-success/10 flex items-center justify-center text-accent-success font-bold">
                  ر
                </div>
                <div>
                  <span className="font-bold text-text-main block">راتب العمل</span>
                  <span className="text-[10px] text-text-muted">الشركة الأساسية</span>
                </div>
              </div>
              <span className="font-extrabold text-accent-success font-mono">12,000 جنية</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-success/10 border border-accent-success/10 flex items-center justify-center text-accent-success font-bold">
                  ح
                </div>
                <div>
                  <span className="font-bold text-text-main block">عمل حر (Freelance)</span>
                  <span className="text-[10px] text-text-muted">تصميم واجهات</span>
                </div>
              </div>
              <span className="font-extrabold text-accent-success font-mono">4,500 جنية</span>
            </div>
          </div>
        </div>

        {/* كارت 3: تصنيف المصاريف (طافي بمسار 3) */}
        <div className="absolute bottom-[-20px] end-[-25px] w-[280px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-4.5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-three z-30 text-start">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">
            تصنيف المصاريف الأكثر استخدامًا
          </span>
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="74" height="74" viewBox="0 0 36 36" className="transform -rotate-90 origin-center">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--card-border)" strokeWidth="3" />

                {/* الإيجار والخدمات - 40% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3.2"
                  strokeDasharray="40 60"
                  strokeDashoffset="0"
                />
                {/* المشتريات - 35% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--accent-success)"
                  strokeWidth="3.2"
                  strokeDasharray="35 65"
                  strokeDashoffset="-40"
                />
                {/* المواصلات - 25% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--accent-info)"
                  strokeWidth="3.2"
                  strokeDasharray="25 75"
                  strokeDashoffset="-75"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[9px] text-text-muted font-bold uppercase">USD</span>
              </div>
            </div>

            <div className="space-y-1.5 w-full text-xs">
              <div className="flex items-center justify-between font-semibold text-text-main">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>سكن وخدمات</span>
                </div>
                <span className="font-bold font-mono">40%</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-text-main">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent-success" />
                  <span>مشتريات</span>
                </div>
                <span className="font-bold font-mono">35%</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-text-main">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent-info" />
                  <span>مواصلات</span>
                </div>
                <span className="font-bold font-mono">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تعليق اللوحة */}
      <div className="mt-16 text-center max-w-[400px]">
        <h2 className="text-xl font-extrabold text-text-main tracking-tight font-sans mb-2">
          خطط لمستقبلك المالي
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          يساعدك مصروفي على تحقيق أهدافك الادخارية، وتتبع مصادر دخلك، وتصنيف نفقاتك بذكاء لتصل للأمان المالي.
        </p>
      </div>
    </section>
  );
}
