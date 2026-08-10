"use client";

import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";

type DashboardTopBarProps = {
  onOpenSidebar?: () => void;
};

export default function DashboardTopBar({ onOpenSidebar }: DashboardTopBarProps) {
  const { user } = useAuth();
  const displayName = user?.fullname || user?.email || "مستخدم";

  return (
    <header className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-card-border bg-surface/90 backdrop-blur-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="فتح القائمة"
            className="lg:hidden p-2 rounded-xl border border-card-border/60 bg-surface hover:bg-primary-tint/40 text-text-main transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href="/dashboard" className="text-lg font-extrabold text-primary tracking-tight">
          مصروفي
        </Link>
      </div>

      <div className="order-last w-full sm:order-none sm:flex-1 sm:max-w-md sm:mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div>
          <input
            type="search"
            placeholder="بحث..."
            readOnly
            className="w-full bg-input-bg border border-input-border rounded-xl ps-10 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none focus:border-input-focus focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="التنبيهات"
          className="p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-primary-tint/50 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <Link href="/profile" className="ms-1" aria-label="الملف الشخصي">
          <UserAvatar name={displayName} size="sm" />
        </Link>
      </div>
    </header>
  );
}
