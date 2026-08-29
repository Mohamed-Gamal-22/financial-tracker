import { describe, expect, it } from "vitest";
import { ApiError } from "@/services/api/types";
import { isAuthFailureError } from "./auth-failure";

describe("isAuthFailureError", () => {
  it("returns false for non-ApiError values", () => {
    expect(isAuthFailureError(new Error("unauthorized"))).toBe(false);
    expect(isAuthFailureError("unauthorized")).toBe(false);
  });

  it("returns true for 401/403", () => {
    expect(
      isAuthFailureError(
        new ApiError({ message: "x", success: false, status: 401 }),
      ),
    ).toBe(true);
    expect(
      isAuthFailureError(
        new ApiError({ message: "x", success: false, status: 403 }),
      ),
    ).toBe(true);
  });

  it("matches auth failure messages in EN/AR", () => {
    expect(
      isAuthFailureError(
        new ApiError({
          message: "jwt expired",
          success: false,
          status: 400,
        }),
      ),
    ).toBe(true);
    expect(
      isAuthFailureError(
        new ApiError({
          message: "انتهت صلاحية الجلسة",
          success: false,
          status: 400,
        }),
      ),
    ).toBe(true);
    expect(
      isAuthFailureError(
        new ApiError({ message: "validation", success: false, status: 400 }),
      ),
    ).toBe(false);
  });
});
