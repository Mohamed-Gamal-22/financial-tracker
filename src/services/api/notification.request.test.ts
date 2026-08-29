import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./authed-client", () => ({
  authedApiRequest: vi.fn(),
}));

import { authedApiRequest } from "./authed-client";
import { getNotificationById, getNotifications } from "./notification";

describe("notification API wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getNotifications normalizes list payloads", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: {
        items: [
          { _id: "1", message: "تنبيه", createdAt: "2026-03-02T00:00:00.000Z" },
          { _id: "2", message: "قديم", createdAt: "2026-03-01T00:00:00.000Z" },
        ],
      },
    });

    const result = await getNotifications();
    expect(result.data.map((n) => n._id)).toEqual(["1", "2"]);
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/notification"),
      expect.objectContaining({
        method: "GET",
        headers: { "Accept-Language": "ar" },
      }),
    );
  });

  it("getNotificationById uses nested shapes and fallback id", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { notification: { id: "n9", message: "نص" } },
    });

    await expect(getNotificationById("n9")).resolves.toMatchObject({
      data: { _id: "n9", message: "نص" },
    });

    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { message: "بدون معرف" },
    });
    await expect(getNotificationById("fallback")).resolves.toMatchObject({
      data: { _id: "fallback", message: "بدون معرف" },
    });
  });
});
