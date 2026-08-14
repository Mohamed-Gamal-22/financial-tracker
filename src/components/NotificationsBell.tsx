"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationSeen } from "@/hooks/useNotificationSeen";
import { getNotifications } from "@/services/api/notification";
import { countUnreadNotifications } from "@/lib/notification-seen";
import NotificationsList from "@/components/NotificationsList";
import NotificationDetailModal from "@/components/NotificationDetailModal";

export default function NotificationsBell() {
  const panelId = useId();
  const { user } = useAuth();
  const userKey = user?.id || user?.email || null;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { seenIds, markSeen } = useNotificationSeen(userKey);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["notifications", "ar"],
    queryFn: async () => (await getNotifications()).data ?? [],
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const unreadCount = useMemo(
    () => countUnreadNotifications(items, seenIds),
    [items, seenIds],
  );

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
          aria-label="التنبيهات"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-primary-tint/50 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 end-1 min-w-4 h-4 px-1 rounded-full bg-accent-danger text-text-inverse text-[10px] font-extrabold leading-4 text-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
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
