import { authedApiRequest } from "./authed-client";
import { API_LANG, withLangQuery } from "./client";
import type { NotificationItem } from "@/schemas/notification.schema";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readId(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  const row = asRecord(value);
  if (!row) return null;
  const id = row._id ?? row.id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

/** Prefer Arabic when the API returns bilingual strings/objects. */
function pickLocalizedText(
  row: Record<string, unknown>,
  keys: string[],
): string | undefined {
  const arKeys = keys.flatMap((key) => [
    `${key}Ar`,
    `${key}_ar`,
    `${key}AR`,
    `ar_${key}`,
  ]);

  for (const key of arKeys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    const nested = asRecord(value);
    if (nested) {
      const ar =
        (typeof nested.ar === "string" && nested.ar.trim()) ||
        (typeof nested.AR === "string" && nested.AR.trim()) ||
        (typeof nested.arabic === "string" && nested.arabic.trim()) ||
        "";
      if (ar) return ar;
      const en =
        (typeof nested.en === "string" && nested.en.trim()) ||
        (typeof nested.EN === "string" && nested.EN.trim()) ||
        (typeof nested.english === "string" && nested.english.trim()) ||
        "";
      if (en) return en;
    }
  }

  const translations = asRecord(row.translations) ?? asRecord(row.i18n);
  if (translations) {
    const arBag = asRecord(translations.ar) ?? asRecord(translations.AR);
    if (arBag) {
      for (const key of keys) {
        const value = arBag[key];
        if (typeof value === "string" && value.trim()) return value.trim();
      }
    }
  }

  return undefined;
}

export function normalizeNotificationItem(raw: unknown): NotificationItem | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = readId(row._id) ?? readId(row.id);
  if (!id) return null;

  const title = pickLocalizedText(row, ["title", "subject", "heading"]);
  const message = pickLocalizedText(row, ["message", "msg", "text"]);
  const body = pickLocalizedText(row, [
    "body",
    "content",
    "description",
    "details",
  ]);

  const createdAt =
    typeof row.createdAt === "string"
      ? row.createdAt
      : typeof row.created_at === "string"
        ? row.created_at
        : typeof row.date === "string"
          ? row.date
          : undefined;

  return {
    _id: id,
    title,
    message,
    body,
    createdAt,
    isRead: typeof row.isRead === "boolean" ? row.isRead : undefined,
    read: typeof row.read === "boolean" ? row.read : undefined,
    seen: typeof row.seen === "boolean" ? row.seen : undefined,
  };
}

export function normalizeNotifications(data: unknown): NotificationItem[] {
  let list: unknown[] = [];

  if (Array.isArray(data)) {
    list = data;
  } else {
    const root = asRecord(data);
    if (root) {
      const nested =
        root.notifications ??
        root.items ??
        root.results ??
        root.data ??
        root.docs;
      if (Array.isArray(nested)) list = nested;
    }
  }

  const items: NotificationItem[] = [];
  for (const item of list) {
    const normalized = normalizeNotificationItem(item);
    if (normalized) items.push(normalized);
  }

  const hasAnyDate = items.some(
    (item) => item.createdAt && Number.isFinite(Date.parse(item.createdAt)),
  );

  if (hasAnyDate) {
    items.sort((a, b) => {
      const timeA = a.createdAt ? Date.parse(a.createdAt) : NaN;
      const timeB = b.createdAt ? Date.parse(b.createdAt) : NaN;
      const validA = Number.isFinite(timeA);
      const validB = Number.isFinite(timeB);
      if (validA && validB) return timeB - timeA;
      if (validA) return -1;
      if (validB) return 1;
      return 0;
    });
  } else {
    items.reverse();
  }

  return items;
}

function normalizeSingleNotification(
  data: unknown,
  fallbackId?: string,
): NotificationItem | null {
  const direct = normalizeNotificationItem(data);
  if (direct) return direct;

  const root = asRecord(data);
  if (!root) return null;

  const nested =
    root.notification ?? root.data ?? root.item ?? root.result;
  const fromNested = normalizeNotificationItem(nested);
  if (fromNested) return fromNested;

  if (fallbackId) {
    return normalizeNotificationItem({ ...root, _id: fallbackId });
  }
  return null;
}

const notificationLangHeaders = {
  "Accept-Language": API_LANG,
} as const;

/** GET /notification?lang=ar — language comes from the request (query + Accept-Language). */
export async function getNotifications() {
  const response = await authedApiRequest<unknown>(
    withLangQuery("/notification"),
    {
      method: "GET",
      headers: notificationLangHeaders,
    },
  );
  return {
    ...response,
    data: normalizeNotifications(response.data),
  };
}

/** GET /notification/:id?lang=ar */
export async function getNotificationById(id: string) {
  const response = await authedApiRequest<unknown>(
    withLangQuery(`/notification/${id}`),
    {
      method: "GET",
      headers: notificationLangHeaders,
    },
  );
  const normalized = normalizeSingleNotification(response.data, id);
  return {
    ...response,
    data: normalized,
  };
}
