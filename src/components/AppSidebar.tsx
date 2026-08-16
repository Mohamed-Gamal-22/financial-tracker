"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useUserProfile } from "@/hooks/useUserProfile";
import UnreadCountBadge from "@/components/UnreadCountBadge";
import UserAvatar from "@/components/UserAvatar";

export type SidebarItemId =
  | "home"
  | "transactions"
  | "categories"
  | "reports"
  | "budget"
  | "alerts"
  | "profile";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const NAV_ITEMS: {
  id: SidebarItemId;
  label: string;
  href: string;
  icon: ReactNode;
}[] = [
  {
    id: "home",
    label: "الرئيسية",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 013 20V10.5z" />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "المعاملات",
    href: "/transactions",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "categories",
    label: "التصنيفات",
    href: "/categories",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 2l4-4 4 4-4 4-4-4z"
        />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "التقارير",
    href: "/reports",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "budget",
    label: "الميزانية",
    href: "/budget",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "التنبيهات",
    href: "/notifications",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function AppSidebar({
  activeItem,
  mobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const { logout } = useAuth();
  const { displayName, profilePic } = useUserProfile();
  const { unreadCount } = useNotifications();
  const [loggingOut, setLoggingOut] = useState(false);
  const profileActive = activeItem === "profile";

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout({ flag: "one", callbackUrl: "/login" });
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-40 bg-text-main/30 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 start-0 z-50 flex w-[280px] flex-col border-e border-card-border bg-surface/95 backdrop-blur-xl shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-6 text-center">
          <Link href="/dashboard" className="flex flex-col items-center gap-2" onClick={onCloseMobile}>
            <img src="/logo.png" alt="مصروفي" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-xl font-extrabold text-primary tracking-tight">مصروفي</p>
              <p className="text-xs font-medium text-text-muted mt-0.5">إدارة مالية ذكية</p>
            </div>
          </Link>
        </div>

        <nav className="px-4 pb-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeItem === item.id;
            const isAlerts = item.id === "alerts";
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                aria-label={
                  isAlerts && unreadCount > 0
                    ? `التنبيهات، ${unreadCount} غير مقروءة`
                    : undefined
                }
                className={[
                  "flex items-center gap-3 rounded-xl border border-card-border px-3.5 py-2.5 text-sm font-bold transition-colors",
                  active
                    ? "bg-primary-tint text-primary border-primary/30"
                    : "text-text-main/80 hover:bg-primary-tint/50 hover:text-primary",
                ].join(" ")}
              >
                <span
                  className={[
                    "relative inline-flex",
                    active ? "text-primary" : "text-text-muted",
                  ].join(" ")}
                >
                  {item.icon}
                  {isAlerts && <UnreadCountBadge count={unreadCount} />}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-card-border" />

        <div className="px-4 pt-3 pb-5 space-y-1">
          <Link
            href="/profile"
            onClick={onCloseMobile}
            aria-current={profileActive ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-xl border border-card-border px-3.5 py-2.5 text-sm font-bold transition-colors",
              profileActive
                ? "bg-primary-tint text-primary border-primary/30"
                : "text-text-main/80 hover:bg-primary-tint/50 hover:text-primary",
            ].join(" ")}
          >
            <UserAvatar
              name={displayName}
              imageUrl={profilePic}
              size="sm"
              className="h-5 w-5 text-[9px] shadow-none ring-2 ring-card-border ring-offset-2 ring-offset-surface"
            />
            الملف الشخصي
          </Link>

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-text-muted hover:text-accent-danger hover:bg-accent-danger/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </aside>
    </>
  );
}
