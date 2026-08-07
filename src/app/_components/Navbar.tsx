"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/UserAvatar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const loggedIn = !isLoading && isAuthenticated && user;
  const homeHref = loggedIn ? "/profile" : "/";
  const fullname = user?.fullname || "";

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b border-card-border/60  transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={homeHref} className="flex items-center gap-2 group">
            <img src="/logo.png" alt="مصروفي" className="size-14" />
          </Link>
        </div>

        {!loggedIn && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-text-main/80 hover:text-primary transition-all duration-300 ease-in-out">
              الميزات والخدمات
            </a>
            <a href="#calculator" className="text-sm font-semibold text-text-main/80 hover:text-primary transition-all duration-300 ease-in-out">
              حاسبة الادخار
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-text-main/80 hover:text-primary transition-all duration-300 ease-in-out">
              كيف نعمل؟
            </a>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
          {loggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-primary-tint/40 transition-colors"
            >
              <span className="text-sm font-bold text-text-main max-w-[160px] truncate">
                {fullname}
              </span>
              <UserAvatar name={fullname} size="sm" />
            </Link>
          ) : !isLoading ? (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-bold relative after:absolute after:block hover:after:w-[90px] after:transition-all after:w-[0px] after:left-5 after:top-[101%] after:h-0.5 after:bg-primary text-text-main hover:text-primary transition-all duration-300 ease-in-out"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky to-purple hover:shadow-lg hover:shadow-primary/25 rounded-xl transition-all active:scale-[0.98] duration-300"
              >
                ابدأ مجاناً
              </Link>
            </>
          ) : null}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl outline-0 border border-card-border/40 hover:bg-primary-tint/20 text-text-main transition-all duration-300"
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

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 start-0 w-full bg-surface/95 border-b border-card-border/60 backdrop-blur-xl py-6 px-4 space-y-4 shadow-xl z-40 animate-fade-in">
          {!loggedIn && (
            <>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-text-main/80 hover:text-primary hover:bg-primary-tint rounded-xl transition-all duration-300"
              >
                الميزات والخدمات
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-text-main/80 hover:text-primary hover:bg-primary-tint rounded-xl transition-all duration-300"
              >
                حاسبة الادخار
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-text-main/80 hover:text-primary hover:bg-primary-tint rounded-xl transition-all duration-300"
              >
                كيف نعمل؟
              </a>
            </>
          )}
          <div className="border-t border-card-border/40 pt-4 flex flex-col gap-3">
            {loggedIn ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-2.5 text-text-main hover:bg-primary-light border border-card-border/40 rounded-xl transition-all duration-300"
              >
                <UserAvatar name={fullname} size="sm" />
                <span className="font-bold">{fullname}</span>
              </Link>
            ) : !isLoading ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-text-main hover:bg-primary-light border hover:shadow-lg border-card-border/40 rounded-xl transition-all duration-300"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-white bg-gradient-to-r from-sky to-purple rounded-xl shadow-lg shadow-primary/10 transition-all duration-300"
                >
                  ابدأ مجاناً
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
