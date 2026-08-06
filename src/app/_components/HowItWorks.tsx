import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-card-border bg-card-bg/10 relative">
      <div className="max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-3">
          <span className="text-sm font-bold text-[#333] uppercase tracking-wider">الرحلة إلى الاستقرار المالي</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] my-4 p-4 bg-gradient-to-r bg-clip-text text-transparent from-[#fd7f9b] to-[#fd3c60] tracking-tight">
            كيف تبدأ مع مصروفي في 3 خطوات بسيطة؟
          </h2>
          <p className="text-[#333] max-w-xl mx-auto text-sm sm:text-base font-medium">
            الوصول للأمان المالي أسهل مما تتوقع. كل ما تحتاجه هو اتباع الخطوات التالية:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* خط توصيل بصري للمراحل (شاشات الكمبيوتر) */}
          <div className="hidden md:block absolute top-16 start-[15%] end-[15%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/30 to-accent-info/10 z-0" />

          {/* خطوة 1 */}
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1c1f29] shadow-lg shadow-primary/20 text-white font-extrabold text-lg flex items-center justify-center mx-auto border-4 border-blue-500 ">
              1
            </div>
            <h3 className="text-lg font-bold text-[#333] mt-8">أنشئ حسابك المجاني</h3>
            <p className="text-xs sm:text-sm text-[#333] font-medium leading-relaxed max-w-xs mx-auto">
              سجل بريدك الإلكتروني في أقل من دقيقة، وابدأ رحلتك المالية فوراً دون تعقيد أو إدخال بطاقات دفع.
            </p>
          </div>

          {/* خطوة 2 */}
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1c1f29] shadow-lg shadow-primary/20 text-white font-extrabold text-lg flex items-center justify-center mx-auto border-4 border-blue-500 ">
              2
            </div>
            <h3 className="text-lg font-bold text-[#333] mt-8">حدد دخل وميزانية شهرك</h3>
            <p className="text-xs sm:text-sm text-[#333] font-medium leading-relaxed max-w-xs mx-auto">
              أدخل مصادر دخلك، وحدد المبالغ المرصودة للمصاريف والأهداف الادخارية لتصنع هيكلك المالي الخاص.
            </p>
          </div>

          {/* خطوة 3 */}
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1c1f29] shadow-lg shadow-primary/20 text-white font-extrabold text-lg flex items-center justify-center mx-auto border-4 border-blue-500 ">
              3
            </div>
            <h3 className="text-lg font-bold text-[#333] mt-8">سجل وراقب أموالك تنمو</h3>
            <p className="text-xs sm:text-sm text-[#333] font-medium leading-relaxed max-w-xs mx-auto">
              دوّن نفقاتك أولاً بأول، وتأمل في الإحصائيات الأسبوعية والتحليلات لترى مدخراتك وهي تكبر شهراً بعد شهر.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
