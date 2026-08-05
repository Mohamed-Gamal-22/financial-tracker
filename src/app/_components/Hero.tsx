import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* النص التسويقي والدعوة للتسجيل (يمين في RTL) */}
        <div className="lg:col-span-6 space-y-8 text-start order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/80 rounded-full text-xs font-bold text-[#000] select-none animate-pulse-slow">
            <span>✨</span>
            <span className="">شريكك الذكي للأمان والحرية المالية</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl bg-gradient-to-r from-[#0ea5e9] to-[#4f46e5] bg-clip-text text-transparent  sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.2] text-[#1c1f29]  font-sans">
              وداعاً لعشوائية المصاريف..
              <span className="block mt-2 bg-clip-text text-transparent">
                أهلاً بالحرية المالية مع مصروفي!
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#666] font-medium leading-relaxed max-w-xl">
              أول منصة ذكية تساعدك على تتبع كل قرش تنفقه، تخطيط ميزانياتك الشهرية بدقة، وبناء عادات ادخار مستدامة دون حرمان. ابدأ تنظيم أموالك اليوم مجاناً.
            </p>
          </div> 
          {/* مؤشرات المصداقية والثقة */}
          <div className=" border-card-border/60 flex justify-center md:justify-start flex-wrap items-center gap-6 text-xs text-text-muted font-medium">
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>مجاني تماماً للبدء</span>
            </div>
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>حماية بيانات مشفرة بالكامل</span>
            </div>
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>لا حاجة لربط حساب بنكي</span>
            </div>
          </div>
          {/* أزرار الدعوة للإجراء (CTA) */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md sm:max-w-none order-last">
            <Link
              href="/register"
              className="group w-full relative px-8 py-4 text-center font-bold text-white bg-gradient-to-r from-[#0ea5e9]  to-[#4f46e5] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>ابدأ رحلتك المالية مجاناً</span>
              <svg className="w-5 h-5 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

          </div>


        </div>

        {/* لوحة التحكم الوهمية المتحركة والمميزات البصرية (يسار في RTL) - تختفي في الشاشات الصغيرة */}
        <div className="hidden lg:flex lg:col-span-6 relative w-full h-[450px] items-center justify-center order-1 lg:order-2 select-none">
          {/* الدائرة المتوهجة في الخلفية */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr  blur-[60px] animate-pulse-slow pointer-events-none" />

          <div className="relative w-full max-w-[500px] h-[450px]">
            {/* الكرت الأول: هدف الادخار المتحرك (مبعد إلى اليمين والأسفل قليلاً) */}
            <div className="absolute top-28 start-[-40px] w-[320px] bg-[#1c1f29] border border-slate-700/50 backdrop-blur-xl rounded-2xl p-5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 animate-card-one text-start text-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
                    مستوى الادخار لشهر أغسطس
                  </span>
                  <span className="text-xl font-extrabold text-white tracking-tight font-sans mt-1 block">
                    تم توفير 4,200 من 6,000 ج.م
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-accent-success/15 border border-accent-success/20 rounded-full text-[10px] font-extrabold text-accent-success">
                  <span>70%</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-300 font-medium mb-3">توفيرك ممتاز هذا الشهر، استمر في الالتزام بميزانيتك.</p>
              <div className="w-full bg-card-border/50 h-3 rounded-full overflow-hidden p-[2px] border border-[#fd7f9b]">
                <div className="bg-gradient-to-r from-[#fd7f9b] to-[#fd3c60] h-full rounded-full w-[70%]" />
              </div>
            </div>

            {/* الكرت الثاني: الراتب والدخل (مبعد إلى الأعلى واليسار أكثر) */}
            <div className="absolute top-2 end-[-80px] w-[240px] bg-[#1c1f29] border border-slate-700/50 backdrop-blur-xl rounded-2xl p-4.5 shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 animate-card-two z-20 text-start text-white">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-3">
                مصادر الدخل الموثقة
              </span>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-extrabold bg-gradient-to-r from-[#fd7f9b] to-[#fd3c60]">
                      ر
                    </div>
                    <div>
                      <span className="font-bold text-white block">الراتب الأساسي</span>
                      <span className="text-[9px] text-gray-400">شركة التقنية</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-accent-success">+15,000 ج.م</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary font-extrabold">
                      ع
                    </div>
                    <div>
                      <span className="font-bold text-white block">عمل حر</span>
                      <span className="text-[9px] text-gray-400">مشروع تصميم</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-accent-success">+3,500 ج.م</span>
                </div>
              </div>
            </div>

            {/* الكرت الثالث: توزيع المصاريف تفاعلياً (مبعد إلى الأسفل واليسار أكثر) */}
            <div className="absolute bottom-2 end-[-30px] w-[260px] bg-[#1c1f29] border border-slate-700/50 backdrop-blur-xl rounded-2xl p-4 shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 animate-card-three z-30 text-start text-white">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2.5">
                توزيع المصاريف الأسبوعية
              </span>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center shrink-0 ">
                  <svg width="60" height="60" viewBox="0 0 36 36" className="transform -rotate-90 origin-center">
                    {/* bg-gradient-to-r from-[#fd7f9b] to-[#fd3c60] */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fd7f9b" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fd7f9b" strokeWidth="3" strokeDasharray="50 50" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fd7f9b" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-50" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fd3c60" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" />
                  </svg>
                </div>
                <div className="space-y-1 w-full text-[11px] font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">🛒 بقالة وتسوق</span>
                    <span className="font-bold text-white">50%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">☕ رفاهية ومقاهي</span>
                    <span className="font-bold text-white">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">🚗 مواصلات</span>
                    <span className="font-bold text-white">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
