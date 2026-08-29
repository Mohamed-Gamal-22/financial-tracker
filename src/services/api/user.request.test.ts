import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./authed-client", () => ({
  authedApiRequest: vi.fn(),
}));

vi.mock("./client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return {
    ...actual,
    apiRequest: vi.fn(),
  };
});

import { authedApiRequest } from "./authed-client";
import { apiRequest } from "./client";
import {
  deleteProfilePic,
  freezeAccount,
  getProfile,
  logoutUser,
  rotateToken,
  updateUserName,
  uploadProfilePic,
} from "./user";

describe("user API wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getProfile normalizes nested and root payloads", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { user: { _id: "1", fullname: "أحمد محمد", email: "a@b.com" } },
    });
    await expect(getProfile()).resolves.toMatchObject({
      data: { _id: "1", fullname: "أحمد محمد", email: "a@b.com" },
    });
  });

  it("updateUserName prefers submitted name when API mismatches", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { _id: "1", fullname: "Other", email: "a@b.com", profilePic: null },
    });
    const result = await updateUserName("أحمد محمد");
    expect(result.data?.fullname).toBe("أحمد محمد");
    expect(result.data).not.toHaveProperty("profilePic");
  });

  it("uploadProfilePic appends file and falls back to getProfile", async () => {
    const file = new File(["x"], "pic.jpg", { type: "image/jpeg" });
    vi.mocked(authedApiRequest)
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: {},
      })
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: {
          _id: "1",
          fullname: "A",
          email: "a@b.com",
          profilePic: "https://cdn.example.com/a.jpg",
        },
      });

    const result = await uploadProfilePic(file);
    expect(result.data?.url).toBe("https://cdn.example.com/a.jpg");
    const firstCall = vi.mocked(authedApiRequest).mock.calls[0];
    expect(firstCall[0]).toContain("/user/profile-pic");
    expect(firstCall[1]?.body).toBeInstanceOf(FormData);
  });

  it("logout / freeze / deleteProfilePic / rotateToken call expected endpoints", async () => {
    vi.mocked(authedApiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
    });
    vi.mocked(apiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { access_token: "a", refresh_token: "r" },
    });

    await logoutUser("all");
    await freezeAccount();
    await deleteProfilePic();
    await rotateToken("refresh");

    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/user/logout"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ flag: "all" }),
      }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/user/freeze"),
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(authedApiRequest).toHaveBeenCalledWith(
      expect.stringContaining("/user/profile-pic"),
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(apiRequest).toHaveBeenCalledWith("/user/rotate-token", {
      method: "POST",
      accessToken: "refresh",
    });
  });
});
