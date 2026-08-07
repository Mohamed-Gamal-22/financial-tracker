"use client";

import React, { useState } from "react";

export default function Calculator() {
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [years, setYears] = useState(5);

  const totalSaved = monthlySavings * 12 * years;

  // حساب استثمار افتراضي بفائدة سنوية مركبة 12%
  const annualRate = 0.12;
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;
  let compoundAmount = 0;

  for (let i = 0; i < totalMonths; i++) {
    compoundAmount = (compoundAmount + monthlySavings) * (1 + monthlyRate);
  }
  const totalInvested = Math.round(compoundAmount);

  // جملة توضيحية للمبلغ المدخر
  const getSavingsGoalText = (amount: number) => {
    if (amount < 15000) return "تأمين صندوق طوارئ سريع للأزمات البسيطة 🛡️";
    if (amount < 60000) return "تمويل رحلة سياحية مميزة أو شراء أجهزة ذكية حديثة ✈️";
    if (amount < 150000) return "توفير دفعة أولى لسيارة أحلامك أو بدء مشروعك الصغير الخاص 🚗";
    if (amount < 400000) return "تأمين زواج متكامل أو دفعة أولى لشقة سكنية ممتازة 🏠";
    return "تحقيق الحرية المالية البدئية والوصول لمرحلة الأمان الاستثماري 💎";
  };

  return (
    <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-tint/20 border-y border-primary-mid/10 relative">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">جرّب بنفسك وعاين قوتك المالية</span>
          <h2 className="text-3xl sm:text-4xl my-6 font-extrabold text-text-main bg-gradient-to-r bg-clip-text text-transparent from-sky to-purple">
            محاكي التوفير والادخار الذكي
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base font-medium">
            اسحب الشريط لتعديل المبلغ الذي ترغب في توفيره شهرياً وعدد السنوات، لترى كيف ستنمو أموالك بفضل الاستمرار والاستثمار الذكي!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* خيارات التحكم */}
          <div className="lg:col-span-6 bg-surface border border-primary-mid/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-8 text-start flex flex-col justify-center">
            {/* خيار المبلغ الشهري */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-text-main">المبلغ المدخر شهرياً:</label>
                <span className="text-lg font-extrabold text-primary font-mono">{monthlySavings.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full h-2 bg-primary-mid/30 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-text-muted font-bold font-mono">
                <span>100 ج.م</span>
                <span>5,000 ج.م</span>
                <span>10,000 ج.م</span>
              </div>
            </div>

            {/* خيار عدد السنوات */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-text-main">مدة الادخار والاستثمار:</label>
                <span className="text-lg font-extrabold text-primary font-mono">{years} {years > 10 ? "سنة" : years >= 3 ? "سنوات" : "سنتين"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-primary-mid/30 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-text-muted font-bold font-mono">
                <span>سنة واحدة</span>
                <span>8 سنوات</span>
                <span>15 سنة</span>
              </div>
            </div>
          </div>

          {/* عرض النتائج البصري */}
          <div className="lg:col-span-6 bg-gradient-to-br from-sky/10 to-purple/5 border border-primary/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-start relative overflow-hidden">
            <div className="absolute top-0 end-0 w-32 h-32 bg-sky/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">المجموع الفعلي لمدخراتك</span>
                <div className="text-3xl sm:text-4xl font-black text-text-main tracking-tight font-sans">
                  {totalSaved.toLocaleString()} <span className="text-sm font-bold text-text-muted">جنية مصري</span>
                </div>
              </div>

              <div className="pt-4 border-t border-card-border/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-accent-success font-bold uppercase tracking-wider block">المجموع لو استثمرت مع عائد 12% سنوياً</span>
                  <span className="px-1.5 py-0.5 bg-accent-success/15 rounded text-[9px] text-accent-success font-bold">قوة الفائدة المركبة</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-accent-success tracking-tight font-sans">
                  {totalInvested.toLocaleString()} <span className="text-sm font-bold text-text-muted">جنية مصري</span>
                </div>
                <span className="text-[10px] text-text-muted mt-1 block">اربح عوائد تراكمية إضافية تبلغ {(totalInvested - totalSaved).toLocaleString()} ج.م!</span>
              </div>
            </div>

            {/* الاستنتاج والتحفيز */}
            <div className="mt-8 bg-primary-tint border border-primary-mid/20 p-4 rounded-2xl">
              <span className="text-[11px] font-extrabold text-primary block mb-1">هذا المبلغ يتيح لك:</span>
              <p className="text-xs text-text-main font-semibold leading-relaxed">
                {getSavingsGoalText(totalSaved)}
              </p>
              <p className="text-[10px] text-text-muted mt-2">
                * الحسابات تقريبية لتوضيح أثر التوفير والاستثمار وتعتمد على ثبات الإيداع بشكل شهري متواصل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
