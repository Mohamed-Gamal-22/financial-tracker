import React from "react";

export default function DashboardShowcase() {
  return (
    <section className="flex-1 hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden bg-gradient-to-tr from-primary/5 via-transparent to-accent-info/5 select-none">
      {/* تأثير الإضاءة الخلفية */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* خطوط الخلفية التقنية */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* الحاوية المركزية للوحة التحكم الوهمية */}
      <div className="relative w-full max-w-[500px] h-[400px]">
        {/* كارت 1: إجمالي الرصيد والترند (طافي بمسار 1) */}
        <div className="absolute top-16 start-[-30px] w-[380px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-one text-start">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                إجمالي الرصيد
              </span>
              <span className="text-3xl font-extrabold text-text-main tracking-tight font-sans mt-1 block font-mono">
                14,200,00 جنية
              </span>
            </div>
            <div className="px-2.5 py-1 bg-accent-success/15 border border-accent-success/20 rounded-full text-xs font-bold text-accent-success flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span>+12.4%</span>
            </div>
          </div>

          {/* رسم بياني SVG للمنحنى المالي */}
          <div className="h-16 w-full mt-6">
            <svg className="w-full h-full" viewBox="0 0 300 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 55 C 30 50, 45 20, 75 35 C 105 50, 120 15, 150 25 C 180 35, 195 5, 225 15 C 255 25, 270 3, 300 5 L 300 70 L 0 70 Z"
                fill="url(#chart-grad)"
              />
              <path
                d="M 0 55 C 30 50, 45 20, 75 35 C 105 50, 120 15, 150 25 C 180 35, 195 5, 225 15 C 255 25, 270 3, 300 5"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="300" cy="5" r="4" fill="var(--primary)" />
              <circle cx="300" cy="5" r="8" fill="var(--primary)" opacity="0.3" className="animate-ping origin-center" />
            </svg>
          </div>
        </div>

        {/* كارت 2: أحدث المعاملات (طافي بمسار 2) */}
        <div className="absolute top-2 end-[-120px] w-[280px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-two z-20 text-start">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3.5">
            أحدث المعاملات
          </span>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-light/50 border border-primary/10 flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div>
                  <span className="font-bold text-text-main block">دفعة قسط الشقه</span>
                  <span className="text-[10px] text-text-muted">تحويل مباشر</span>
                </div>
              </div>
              <span className="font-extrabold text-accent-success font-mono">6000,00 جنية </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-danger/10 border border-accent-danger/10 flex items-center justify-center text-accent-danger font-bold">
                  A
                </div>
                <div>
                  <span className="font-bold text-text-main block">فاتوره المياه</span>
                  <span className="text-[10px] text-text-muted">البنية التحتية</span>
                </div>
              </div>
              <span className="font-extrabold text-text-main font-mono">350,00 جنية</span>
            </div>
          </div>
        </div>

        {/* كارت 3: توزيع المحفظة/الأصول (طافي بمسار 3) */}
        <div className="absolute bottom-[-20px] end-[-25px] w-[280px] bg-visual-card-bg border border-visual-card-border backdrop-blur-xl rounded-2xl p-4.5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-500 animate-card-three z-30 text-start">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">
            توزيع المحفظة
          </span>
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="74" height="74" viewBox="0 0 36 36" className="transform -rotate-90 origin-center">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--card-border)" strokeWidth="3" />

                {/* الأسهم - 55% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3.2"
                  strokeDasharray="55 45"
                  strokeDashoffset="0"
                />
                {/* العقارات - 30% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--accent-success)"
                  strokeWidth="3.2"
                  strokeDasharray="30 70"
                  strokeDashoffset="-55"
                />
                {/* النقدية - 15% */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke="var(--accent-info)"
                  strokeWidth="3.2"
                  strokeDasharray="15 85"
                  strokeDashoffset="-85"
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
                  <span>الفواتير</span>
                </div>
                <span className="font-bold font-mono">55%</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-text-main">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent-success" />
                  <span>مصاريف شخصيه</span>
                </div>
                <span className="font-bold font-mono">30%</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-text-main">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent-info" />
                  <span>النقدية</span>
                </div>
                <span className="font-bold font-mono">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تعليق اللوحة */}
      <div className="mt-16 text-center max-w-[400px]">
        <h2 className="text-xl font-extrabold text-text-main tracking-tight font-sans mb-2">
          الذكاء المالي المؤتمت
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          يقوم تطبيق مصروفي بدمج حساباتك، وتوقع نفقاتك، وجعل التخطيط المالي والميزانية عملية تلقائية وسهلة.
        </p>
      </div>
    </section>
  );
}
