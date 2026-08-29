import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "./types";
import { apiRequest } from "./client";

describe("apiRequest", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns successful payloads", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: "ok",
        success: true,
        status: 200,
        data: { id: 1 },
      }),
    } as Response);

    await expect(apiRequest("/x", { method: "GET" })).resolves.toMatchObject({
      success: true,
      data: { id: 1 },
    });
  });

  it("attaches Authorization and Accept-Language headers", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: "", success: true, status: 200 }),
    } as Response);

    await apiRequest("/x", { accessToken: "tok" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/x"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
          "Accept-Language": "ar",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("throws ApiError on non-OK or success:false", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        message: "bad",
        success: false,
        status: 400,
      }),
    } as Response);

    await expect(apiRequest("/x")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws ApiError when JSON parsing fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("no json");
      },
    } as Response);

    await expect(apiRequest("/x")).rejects.toMatchObject({
      message: "استجابة غير صالحة من الخادم",
    });
  });
});
