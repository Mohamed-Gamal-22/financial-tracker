import { describe, expect, it } from "vitest";
import {
  countUnreadNotifications,
  isNotificationUnread,
} from "./notification-seen";
import type { NotificationItem } from "@/schemas/notification.schema";

const item = (overrides: Partial<NotificationItem> = {}): NotificationItem => ({
  _id: "1",
  message: "hi",
  ...overrides,
});

describe("isNotificationUnread / countUnreadNotifications", () => {
  it("treats locally seen ids as read", () => {
    expect(isNotificationUnread(item(), ["1"])).toBe(false);
    expect(isNotificationUnread(item(), new Set(["1"]))).toBe(false);
  });

  it("respects API read flags", () => {
    expect(isNotificationUnread(item({ isRead: true }), [])).toBe(false);
    expect(isNotificationUnread(item({ read: true }), [])).toBe(false);
    expect(isNotificationUnread(item({ seen: true }), [])).toBe(false);
    expect(isNotificationUnread(item({ isRead: false }), [])).toBe(true);
  });

  it("defaults to unread when no flags are set", () => {
    expect(isNotificationUnread(item(), [])).toBe(true);
  });

  it("counts unread items", () => {
    const items = [
      item({ _id: "a" }),
      item({ _id: "b", isRead: true }),
      item({ _id: "c" }),
    ];
    expect(countUnreadNotifications(items, ["a"])).toBe(1);
  });
});
