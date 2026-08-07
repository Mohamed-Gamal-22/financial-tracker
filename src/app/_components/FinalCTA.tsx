import React from "react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-sky to-purple text-white p-8 sm:p-12 lg:p-16 text-center space-y-8 shadow-2xl outline-4 outline-white outline-offset-3">
        {/* تأثير توهج داخلي */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_60%)] pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight">
            هل أنت جاهز لاستعادة السيطرة الكاملة على أموالك؟
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed">
            انضم إلى آلاف المستخدمين الذين يثقون في مصروفي لتنظيم مصروفاتهم وتوفير أموالهم وتحقيق أهدافهم المستقبلية.
          </p>
        </div>

        <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 font-bold text-primary bg-white hover:bg-primary-tint rounded-2xl shadow-xl transition-all duration-300 text-center"
          >
            سجل حسابك المجاني الآن
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 font-bold text-white border border-white/30 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-center"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </section>
  );
}
