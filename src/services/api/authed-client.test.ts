import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./types";
import { REFRESH_TOKEN_ERROR } from "@/services/auth/refresh-constants";

vi.mock("next-auth/react", () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/services/auth/force-session-rotate", () => ({
  forceSessionTokenRotate: vi.fn(),
}));

vi.mock("@/services/api/client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return {
    ...actual,
    apiRequest: vi.fn(),
  };
});

import { getSession, signOut } from "next-auth/react";
import { forceSessionTokenRotate } from "@/services/auth/force-session-rotate";
import { apiRequest } from "./client";
import { authedApiRequest } from "./authed-client";

describe("authedApiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends request with session access token", async () => {
    vi.mocked(getSession).mockResolvedValue({
      accessToken: "tok",
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    } as never);
    vi.mocked(apiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { ok: true },
    });

    await expect(authedApiRequest("/x")).resolves.toMatchObject({
      data: { ok: true },
    });
    expect(apiRequest).toHaveBeenCalledWith(
      "/x",
      expect.objectContaining({ accessToken: "tok" }),
    );
  });

  it("throws when there is no access token", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    vi.mocked(forceSessionTokenRotate).mockResolvedValue(null);

    await expect(authedApiRequest("/x")).rejects.toThrow(
      "يجب تسجيل الدخول أولاً",
    );
  });

  it("rotates and retries on auth failure", async () => {
    vi.mocked(getSession).mockResolvedValue({
      accessToken: "old",
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    } as never);
    vi.mocked(apiRequest)
      .mockRejectedValueOnce(
        new ApiError({ message: "jwt expired", success: false, status: 401 }),
      )
      .mockResolvedValueOnce({
        message: "ok",
        success: true,
        status: 200,
        data: { ok: true },
      });
    vi.mocked(forceSessionTokenRotate).mockResolvedValue({
      accessToken: "fresh",
    } as never);

    await expect(authedApiRequest("/x")).resolves.toMatchObject({
      data: { ok: true },
    });
    expect(apiRequest).toHaveBeenCalledTimes(2);
    expect(apiRequest).toHaveBeenLastCalledWith(
      "/x",
      expect.objectContaining({ accessToken: "fresh" }),
    );
  });

  it("signs out when refresh fails after auth error", async () => {
    vi.mocked(getSession).mockResolvedValue({
      accessToken: "old",
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    } as never);
    vi.mocked(apiRequest).mockRejectedValue(
      new ApiError({ message: "unauthorized", success: false, status: 401 }),
    );
    vi.mocked(forceSessionTokenRotate).mockResolvedValue({
      error: REFRESH_TOKEN_ERROR,
    } as never);

    await expect(authedApiRequest("/x")).rejects.toBeInstanceOf(ApiError);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
