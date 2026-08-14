import { localizeNotificationText } from "@/lib/notification-i18n";

export type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  body?: string;
  createdAt?: string;
  isRead?: boolean;
  read?: boolean;
  seen?: boolean;
};

export function notificationText(item: NotificationItem): string {
  const text =
    item.message?.trim() ||
    item.body?.trim() ||
    item.title?.trim() ||
    "إشعار جديد";
  return localizeNotificationText(text);
}
