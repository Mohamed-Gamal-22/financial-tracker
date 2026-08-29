"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import NotificationsList from "@/components/NotificationsList";
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { items, seenIds, markSeen, isLoading, isError } = useNotifications();

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6 pb-8">
          <div className="flex items-start gap-3 text-start">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
              className="lg:hidden mt-1 p-2 rounded-xl border border-card-border/60 bg-surface hover:bg-primary-tint/40 text-text-main transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
                التنبيهات
              </h1>
              <p className="mt-1 text-sm font-medium text-text-muted">
                إشعارات تجاوز 80% من ميزانية المصروف الشهري (من السيرفر)
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-4 sm:p-5">
            <NotificationsList
              items={items}
              seenIds={seenIds}
              isLoading={isLoading}
              isError={isError}
              onItemClick={(item) => {
                markSeen([item._id]);
                setDetailId(item._id);
              }}
            />
          </section>
        </div>
      </main>

      <NotificationDetailModal
        open={Boolean(detailId)}
        notificationId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
