"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed  top-0 z-50 w-full bg-[#1c1f29] border-b border-slate-800 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* الشعار والاسم */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="logo.png" alt="" className="size-25" />
          </Link>
        </div>

        {/* روابط التنقل (شاشات الكمبيوتر) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 ease-in-out">
            الميزات والخدمات
          </a>
          <a href="#calculator" className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 ease-in-out">
            حاسبة الادخار
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 ease-in-out">
            كيف نعمل؟
          </a>
        </nav>

        {/* أزرار الإجراءات (شاشات الكمبيوتر) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-bold relative after:absolute after:block hover:after:w-[90px] after:transition-all after:w-[0px] after:left-5 after:top-[101%] after:h-0.5 after:bg-[#fd7f9b] text-white transition-all duration-300 ease-in-out"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#fd7f9b] to-[#fd3c60] hover:shadow-lg hover:shadow-primary/25 rounded-xl transition-all active:scale-[0.98] duration-300"
          >
            ابدأ مجاناً
          </Link>
        </div>

        {/* زر قائمة الموبايل */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl outline-0 border-0 border border-slate-800 hover:bg-white/5 text-white transition-all duration-300"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 start-0 w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl py-6 px-4 space-y-4 shadow-xl z-40 animate-fade-in">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-[#fd7f9b] rounded-xl transition-all duration-300"
          >
            الميزات والخدمات
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-[#fd7f9b] rounded-xl transition-all duration-300"
          >
            حاسبة الادخار
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-[#fd7f9b] rounded-xl transition-all duration-300"
          >
            كيف نعمل؟
          </a>
          <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-white hover:bg-white hover:text-[#ff789b]  border border-white/20 rounded-xl transition-all duration-300"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-3 text-white bg-gradient-to-r from-[#fd7f9b] to-[#fd3c60] rounded-xl shadow-lg shadow-primary/10 transition-all duration-300"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
