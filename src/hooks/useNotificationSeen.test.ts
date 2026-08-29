import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/lib/notification-seen", () => ({
  getSeenNotificationIds: vi.fn(() => ["a"]),
  markNotificationsSeen: vi.fn((ids: string[]) => ["a", ...ids]),
  subscribeNotificationSeen: vi.fn(() => () => {}),
}));

import {
  getSeenNotificationIds,
  markNotificationsSeen,
  subscribeNotificationSeen,
} from "@/lib/notification-seen";
import { useNotificationSeen } from "./useNotificationSeen";

describe("useNotificationSeen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSeenNotificationIds).mockReturnValue(["a"]);
    vi.mocked(markNotificationsSeen).mockImplementation((ids) => [
      "a",
      ...ids,
    ]);
    vi.mocked(subscribeNotificationSeen).mockReturnValue(() => {});
  });

  it("loads seen ids and marks new ones", () => {
    const { result } = renderHook(() => useNotificationSeen("user@x.com"));

    expect(getSeenNotificationIds).toHaveBeenCalledWith("user@x.com");
    expect(result.current.seenIds).toEqual(["a"]);

    act(() => {
      result.current.markSeen(["b"]);
    });

    expect(markNotificationsSeen).toHaveBeenCalledWith(["b"], "user@x.com");
    expect(result.current.seenIds).toEqual(["a", "b"]);
  });
});
