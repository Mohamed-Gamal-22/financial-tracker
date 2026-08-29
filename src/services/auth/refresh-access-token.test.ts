import { beforeEach, describe, expect, it, vi } from "vitest";
import { REFRESH_TOKEN_ERROR } from "./refresh-constants";

vi.mock("@/services/api/client", () => ({
  apiRequest: vi.fn(),
}));

vi.mock("@/services/auth/token-expiry", () => ({
  getAccessTokenExpiresAt: vi.fn(() => 1_700_000_000_000),
}));

import { apiRequest } from "@/services/api/client";
import { refreshAccessToken } from "./refresh-access-token";

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns refresh error when refresh token is missing", async () => {
    await expect(refreshAccessToken({} as never)).resolves.toMatchObject({
      error: REFRESH_TOKEN_ERROR,
    });
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("updates tokens on successful rotate", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { access_token: "new-a", refresh_token: "new-r" },
    });

    const result = await refreshAccessToken({
      refreshToken: "old-r",
      accessToken: "old-a",
    } as never);

    expect(result).toMatchObject({
      accessToken: "new-a",
      refreshToken: "new-r",
      accessTokenExpires: 1_700_000_000_000,
      error: undefined,
    });
  });

  it("returns refresh error when payload is incomplete or request throws", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
      data: { access_token: "only" } as never,
    });
    await expect(
      refreshAccessToken({ refreshToken: "r" } as never),
    ).resolves.toMatchObject({ error: REFRESH_TOKEN_ERROR });

    vi.mocked(apiRequest).mockRejectedValue(new Error("network"));
    await expect(
      refreshAccessToken({ refreshToken: "r" } as never),
    ).resolves.toMatchObject({ error: REFRESH_TOKEN_ERROR });
  });
});
