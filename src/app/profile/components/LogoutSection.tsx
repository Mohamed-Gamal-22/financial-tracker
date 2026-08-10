"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/app/(auth)/alerts";
import { ApiError } from "@/services/api/types";
import type { LogoutFlag } from "@/services/api/user";

export default function LogoutSection() {
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const [pending, setPending] = useState<LogoutFlag | null>(null);

  async function handleLogout(flag: LogoutFlag) {
    if (pending) return;
    setPending(flag);

    try {
      await logout({ flag, callbackUrl: "/login" });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "تعذر تسجيل الخروج";
      showAlert({ message, success: false, status: 400 });
      setPending(null);
    }
  }

  return (
    <section className="text-start">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </span>
        <h3 className="text-base font-extrabold text-text-main">تسجيل الخروج</h3>
      </div>

      <div className="rounded-2xl border border-card-border bg-primary-tint/30 p-4 sm:p-5 space-y-3">
        <p className="text-sm font-medium text-text-muted leading-relaxed">
          يمكنك إنهاء الجلسة على هذا الجهاز فقط، أو تسجيل الخروج من كل الأجهزة المرتبطة بحسابك.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => handleLogout("one")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-surface px-5 py-3 text-sm font-bold text-text-main hover:bg-primary-tint/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {pending === "one" ? "جاري الخروج..." : "تسجيل الخروج"}
          </button>

          <button
            type="button"
            disabled={pending !== null}
            onClick={() => handleLogout("all")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent-danger/30 bg-accent-danger/5 px-5 py-3 text-sm font-bold text-accent-danger hover:bg-accent-danger/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {pending === "all" ? "جاري الخروج..." : "تسجيل الخروج من كل الأجهزة"}
          </button>
        </div>
      </div>
    </section>
  );
}
