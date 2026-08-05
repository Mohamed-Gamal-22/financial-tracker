import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border bg-card-bg/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-start">
        {/* تعريف قصير */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-primary to-accent-info rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-white">مصروفي</span>
          </div>
          <p className="text-xs text-text-muted font-medium leading-relaxed max-w-sm">
            منصة عربية ذكية لمساعدتك في تتبع مصاريفك ونفقاتك اليومية، والتحكم في ميزانيتك الشهرية بكفاءة وسرعة فائقة للوصول للأمان المالي الذي تصبو إليه.
          </p>
        </div>

        {/* روابط سريعة */}
        <div className="md:col-span-3 space-y-3.5">
          <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">صفحات المنصة</h4>
          <ul className="space-y-2 text-xs font-semibold text-text-muted">
            <li><a href="#features" className="hover:text-primary transition-colors">الميزات والخدمات</a></li>
            <li><a href="#calculator" className="hover:text-primary transition-colors">حاسبة الادخار التفاعلية</a></li>
            <li><a href="#how-it-works" className="hover:text-primary transition-colors">آلية عمل التطبيق</a></li>
          </ul>
        </div>

        {/* روابط المصادقة */}
        <div className="md:col-span-3 space-y-3.5">
          <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">حسابك الشخصي</h4>
          <ul className="space-y-2 text-xs font-semibold text-text-muted">
            <li><Link href="/login" className="hover:text-primary transition-colors">تسجيل الدخول</Link></li>
            <li><Link href="/register" className="hover:text-primary transition-colors">إنشاء حساب جديد</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-card-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted font-medium gap-4">
        <span>&copy; {new Date().getFullYear()} مصروفي. جميع الحقوق محفوظة.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
          <a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a>
        </div>
      </div>
    </footer>
  );
}
