import { describe, expect, it } from "vitest";
import {
  normalizeNotificationItem,
  normalizeNotifications,
} from "./notification";

describe("normalizeNotificationItem", () => {
  it("reads ids and bilingual fields", () => {
    expect(
      normalizeNotificationItem({
        id: "n1",
        titleAr: "عنوان",
        message: { ar: "نص عربي", en: "English" },
        created_at: "2026-03-01T00:00:00.000Z",
        isRead: false,
      }),
    ).toEqual({
      _id: "n1",
      title: "عنوان",
      message: "نص عربي",
      body: undefined,
      createdAt: "2026-03-01T00:00:00.000Z",
      isRead: false,
      read: undefined,
      seen: undefined,
    });
  });

  it("returns null without an id", () => {
    expect(normalizeNotificationItem({ message: "x" })).toBeNull();
    expect(normalizeNotificationItem(null)).toBeNull();
  });
});

describe("normalizeNotifications", () => {
  it("normalizes nested lists and sorts by date desc", () => {
    const items = normalizeNotifications({
      items: [
        { _id: "1", message: "old", createdAt: "2026-01-01T00:00:00.000Z" },
        { _id: "2", message: "new", createdAt: "2026-03-01T00:00:00.000Z" },
      ],
    });
    expect(items.map((i) => i._id)).toEqual(["2", "1"]);
  });

  it("reverses when no dates are present", () => {
    const items = normalizeNotifications([
      { _id: "a", message: "first" },
      { _id: "b", message: "second" },
    ]);
    expect(items.map((i) => i._id)).toEqual(["b", "a"]);
  });
});
