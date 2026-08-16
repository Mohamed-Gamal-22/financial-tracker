"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import UnreadCountBadge from "@/components/UnreadCountBadge";
import NotificationsList from "@/components/NotificationsList";
import NotificationDetailModal from "@/components/NotificationDetailModal";

export default function NotificationsBell() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { items, unreadCount, seenIds, markSeen, isLoading, isError } =
    useNotifications();

  useEffect(() => {
    if (!open || detailId) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, detailId]);

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-label={
            unreadCount > 0 ? `التنبيهات، ${unreadCount} غير مقروءة` : "التنبيهات"
          }
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-primary-tint/50 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <UnreadCountBadge count={unreadCount} className="absolute top-1 end-1" />
        </button>

        {open && (
          <div
            id={panelId}
            role="dialog"
            aria-label="قائمة الإشعارات"
            className="absolute end-0 top-full mt-2 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-card-border bg-surface shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-card-border">
              <p className="text-sm font-extrabold text-text-main">الإشعارات</p>
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
              >
                عرض الكل
              </Link>
            </div>

            <NotificationsList
              items={items}
              seenIds={seenIds}
              isLoading={isLoading}
              isError={isError}
              compact
              onItemClick={(item) => {
                markSeen([item._id]);
                setDetailId(item._id);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>

      <NotificationDetailModal
        open={Boolean(detailId)}
        notificationId={detailId}
        onClose={() => setDetailId(null)}
      />
    </>
  );
}
