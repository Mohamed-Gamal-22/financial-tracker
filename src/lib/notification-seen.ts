import type { NotificationItem } from "@/schemas/notification.schema";

const STORAGE_PREFIX = "masrofy:notification-seen:";
export const NOTIFICATION_SEEN_CHANGE_EVENT = "masrofy:notification-seen-changed";

function storageKey(userKey?: string | null) {
  return `${STORAGE_PREFIX}${userKey?.trim() || "guest"}`;
}

function emitSeenChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NOTIFICATION_SEEN_CHANGE_EVENT));
}

function readSeenSet(userKey?: string | null): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(userKey));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function writeSeenSet(ids: Set<string>, userKey?: string | null) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      storageKey(userKey),
      JSON.stringify(Array.from(ids)),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function getSeenNotificationIds(userKey?: string | null): string[] {
  return Array.from(readSeenSet(userKey));
}

export function markNotificationsSeen(
  ids: string[],
  userKey?: string | null,
): string[] {
  const set = readSeenSet(userKey);
  for (const id of ids) {
    if (id) set.add(id);
  }
  writeSeenSet(set, userKey);
  emitSeenChange();
  return Array.from(set);
}

/** Sync local seen state across bell + notifications page without reload. */
export function subscribeNotificationSeen(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(NOTIFICATION_SEEN_CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(NOTIFICATION_SEEN_CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Local seen wins (no mark-as-read API yet). API true flags still count as read.
 * Explicit API false must not override a locally opened notification.
 */
export function isNotificationUnread(
  item: NotificationItem,
  seenIds: Iterable<string>,
): boolean {
  const seen = seenIds instanceof Set ? seenIds : new Set(seenIds);
  if (seen.has(item._id)) return false;
  if (item.isRead === true || item.read === true || item.seen === true) {
    return false;
  }
  if (item.isRead === false || item.read === false || item.seen === false) {
    return true;
  }
  return true;
}

export function countUnreadNotifications(
  items: NotificationItem[],
  seenIds: Iterable<string>,
): number {
  return items.reduce(
    (acc, item) => (isNotificationUnread(item, seenIds) ? acc + 1 : acc),
    0,
  );
}
