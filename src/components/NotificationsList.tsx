"use client";

import type { NotificationItem } from "@/schemas/notification.schema";
import { notificationText } from "@/schemas/notification.schema";
import { isNotificationUnread } from "@/lib/notification-seen";
import { formatDateAr } from "@/lib/format";

type NotificationsListProps = {
  items: NotificationItem[];
  seenIds: string[];
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: NotificationItem) => void;
  compact?: boolean;
};

export default function NotificationsList({
  items,
  seenIds,
  isLoading,
  isError,
  emptyMessage = "لا توجد إشعارات بعد",
  onItemClick,
  compact = false,
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <p className={`text-sm font-bold text-text-muted ${compact ? "p-4" : "py-8 text-center"}`}>
        جاري تحميل الإشعارات...
      </p>
    );
  }

  if (isError) {
    return (
      <p className={`text-sm font-bold text-accent-danger ${compact ? "p-4" : "py-8 text-center"}`}>
        تعذر تحميل الإشعارات
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className={`text-sm font-bold text-text-muted ${compact ? "p-4" : "py-8 text-center"}`}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={compact ? "divide-y divide-card-border/70 max-h-80 overflow-y-auto" : "space-y-2"}>
      {items.map((item) => {
        const unread = isNotificationUnread(item, seenIds);
        const content = (
          <>
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm leading-relaxed ${
                  unread
                    ? "font-extrabold text-text-main"
                    : "font-medium text-text-muted"
                }`}
              >
                {notificationText(item)}
              </p>
              {unread && (
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
              )}
            </div>
            {item.createdAt && (
              <p className="mt-1 text-[11px] font-medium text-text-muted">
                {formatDateAr(item.createdAt)}
              </p>
            )}
          </>
        );

        if (compact) {
          return (
            <li key={item._id}>
              <button
                type="button"
                onClick={() => onItemClick?.(item)}
                className={`w-full text-start px-4 py-3 transition-colors cursor-pointer ${
                  unread
                    ? "bg-primary-tint/50 hover:bg-primary-tint"
                    : "bg-surface hover:bg-primary-tint/30"
                }`}
              >
                {content}
              </button>
            </li>
          );
        }

        return (
          <li key={item._id}>
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              className={`w-full text-start rounded-xl border px-4 py-3 transition-colors cursor-pointer ${
                unread
                  ? "border-primary/25 bg-primary-tint/60 hover:bg-primary-tint"
                  : "border-card-border bg-surface hover:bg-primary-tint/30"
              }`}
            >
              {content}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
