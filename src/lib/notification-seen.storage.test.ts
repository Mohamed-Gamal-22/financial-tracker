import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSeenNotificationIds,
  markNotificationsSeen,
  NOTIFICATION_SEEN_CHANGE_EVENT,
  subscribeNotificationSeen,
} from "./notification-seen";

describe("notification-seen storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty list when storage is empty or corrupt", () => {
    expect(getSeenNotificationIds("u1")).toEqual([]);
    localStorage.setItem("masrofy:notification-seen:u1", "{bad");
    expect(getSeenNotificationIds("u1")).toEqual([]);
    localStorage.setItem("masrofy:notification-seen:u1", JSON.stringify(1));
    expect(getSeenNotificationIds("u1")).toEqual([]);
  });

  it("merges ids, skips empty, and emits change events", () => {
    const listener = vi.fn();
    window.addEventListener(NOTIFICATION_SEEN_CHANGE_EVENT, listener);

    const result = markNotificationsSeen(["a", "", "b"], "User@Domain.Com");
    expect(result.sort()).toEqual(["a", "b"]);
    expect(getSeenNotificationIds("user@domain.com").sort()).toEqual(["a", "b"]);
    expect(listener).toHaveBeenCalled();

    window.removeEventListener(NOTIFICATION_SEEN_CHANGE_EVENT, listener);
  });

  it("subscribes and unsubscribes from seen + storage events", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNotificationSeen(listener);

    window.dispatchEvent(new Event(NOTIFICATION_SEEN_CHANGE_EVENT));
    window.dispatchEvent(new Event("storage"));
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    window.dispatchEvent(new Event(NOTIFICATION_SEEN_CHANGE_EVENT));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
