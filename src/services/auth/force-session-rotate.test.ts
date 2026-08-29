import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCsrfToken, getSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({
  getCsrfToken: vi.fn(),
  getSession: vi.fn(),
}));

import { forceSessionTokenRotate } from "./force-session-rotate";

describe("forceSessionTokenRotate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("falls back to getSession when CSRF is missing", async () => {
    vi.mocked(getCsrfToken).mockResolvedValue(undefined as never);
    vi.mocked(getSession).mockResolvedValue({ accessToken: "a" } as never);

    await expect(forceSessionTokenRotate()).resolves.toMatchObject({
      accessToken: "a",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("posts forceTokenRotate and broadcasts session", async () => {
    vi.mocked(getCsrfToken).mockResolvedValue("csrf");
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: "rotated" }),
    } as Response);
    vi.mocked(getSession).mockResolvedValue({ accessToken: "rotated" } as never);

    await expect(forceSessionTokenRotate()).resolves.toMatchObject({
      accessToken: "rotated",
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({ method: "POST" }),
    );
    expect(getSession).toHaveBeenCalledWith({ broadcast: true });
  });

  it("falls back to getSession when POST fails", async () => {
    vi.mocked(getCsrfToken).mockResolvedValue("csrf");
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    vi.mocked(getSession).mockResolvedValue({ accessToken: "fallback" } as never);

    await expect(forceSessionTokenRotate()).resolves.toMatchObject({
      accessToken: "fallback",
    });
  });
});
