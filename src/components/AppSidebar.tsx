"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import UserAvatar from "@/components/UserAvatar";

export type SidebarItemId =
  | "home"
  | "transactions"
  | "reports"
  | "budget"
  | "alerts"
  | "profile";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  highlightItem?: SidebarItemId;
  onHighlightClick?: () => void;
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
];

const COMING_SOON_ANALYSIS_ICON = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

export default function AppSidebar({
  activeItem,
  mobileOpen = false,
  onCloseMobile,
  highlightItem,
  onHighlightClick,
}: AppSidebarProps) {
  const { logout } = useAuth();
  const { displayName, profilePic } = useUserProfile();
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
          "fixed inset-y-0 start-0 flex w-[280px] flex-col border-e border-card-border bg-surface/95 backdrop-blur-xl shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none",
          highlightItem ? "z-[110] lg:relative lg:z-[110]" : "z-50 lg:z-auto",
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

        <nav className="shrink-0 px-4 pb-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = activeItem === item.id;
            const highlighted = highlightItem === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (highlighted) onHighlightClick?.();
                  onCloseMobile?.();
                }}
                className={[
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition-colors",
                  highlighted
                    ? "border-sky bg-sky/15 text-primary ring-2 ring-sky shadow-lg shadow-sky/25"
                    : active
                      ? "border-primary/30 bg-primary-tint text-primary"
                      : "border-card-border text-text-main/80 hover:bg-primary-tint/50 hover:text-primary",
                ].join(" ")}
              >
                <span
                  className={[
                    "relative inline-flex",
                    active ? "text-primary" : "text-text-muted",
                  ].join(" ")}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <div
            aria-disabled="true"
            aria-label="اسأل خبراءنا لتحليل معاملاتك وتقديم حلول، قريبًا"
            title="قريبًا"
            className="flex items-start gap-3 rounded-xl border border-dashed border-sky/55 bg-gradient-to-l from-sky/15 via-primary-tint/80 to-primary/10 px-3.5 py-2.5 text-sm font-bold cursor-not-allowed select-none"
          >
            <span className="relative mt-0.5 inline-flex shrink-0 rounded-lg bg-sky/20 p-1 text-sky">
              {COMING_SOON_ANALYSIS_ICON}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5 text-start leading-snug">
              <span className="text-primary break-words">
                اسأل خبراءنا لتحليل معاملاتك وتقديم حلول
              </span>
              <span className="w-fit rounded-md bg-sky px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-text-inverse">
                قريبًا
              </span>
            </span>
          </div>
        </nav>

        <div className="mx-4 shrink-0 border-t border-card-border" />

        <div className="shrink-0 px-4 pt-3 pb-5 space-y-1">
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
