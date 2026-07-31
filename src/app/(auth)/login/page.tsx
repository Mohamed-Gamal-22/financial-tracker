"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardShowcase from "./components/DashboardShowcase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-bg-start to-bg-end relative overflow-hidden">
      {/* عناصر الإضاءة الخلفية الزخرفية */}
      <div className="absolute top-[-10%] end-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] start-[-10%] w-[500px] h-[500px] bg-accent-info/10 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* القسم الأيمن: نموذج تسجيل الدخول */}
      <section className="w-full lg:w-[450px] xl:w-[500px] bg-card-bg border-e border-card-border backdrop-blur-xl flex flex-col justify-between p-8 sm:p-12 relative z-10 shadow-2xl">

        <div className="my-auto pb-8">
          <div className="space-y-2 mb-8 text-start">
            <h1 className="font-sans font-extrabold flex justify-between w-full items-center text-3xl text-text-main tracking-tight">
              تسجيل الدخول<img src="/logo.png" className="w-24" alt="" />
            </h1>
            <p className="text-text-muted text-sm font-medium">
              إدارة أموالك وتدفقاتك النقدية ومصاريفك الذكية.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-start">
            <div className="space-y-1.5">
              <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
                  كلمة المرور
                </label>
                <Link href="#" className="text-primary hover:text-primary-hover text-xs font-bold transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-11 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all text-start"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تسجيل الدخول إلى الحساب</span>
            </button>
          </form>

          <div className="relative my-7 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-card-bg text-text-muted font-bold uppercase tracking-wider">
                أو سجل دخولك باستخدام
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-input-border rounded-xl bg-input-bg hover:bg-primary-light/10 text-sm font-bold text-text-main transition-colors cursor-pointer shadow-sm hover:shadow">
              <span>تسجيل الدخول باستخدام </span>
              <span className="flex gap-2"><img src="/gmail.png" alt="Gmail" className="w-6 h-6 object-contain" />
              </span>
            </button>
          </div>
        </div>

        <footer className="text-center text-xs text-text-muted select-none">
          ليس لديك حساب؟{" "}
          <Link href="#" className="text-primary hover:text-primary-hover font-bold transition-colors">
            أنشئ حسابًا جديدًا
          </Link>
        </footer>
      </section>

      {/* القسم الأيسر: الواجهة الرسومية التوضيحية (كروت المحفظة) */}
      <DashboardShowcase />
    </main>
  );
}
