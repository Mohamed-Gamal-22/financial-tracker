import { describe, expect, it } from "vitest";
import { ApiError } from "./types";

describe("ApiError", () => {
  it("defaults message and exposes alert payload", () => {
    const error = new ApiError({
      message: "",
      success: false,
      status: 500,
    });
    expect(error.message).toBe("حدث خطأ ما");
    expect(error.name).toBe("ApiError");
    expect(error.toAlertPayload()).toEqual({
      message: "حدث خطأ ما",
      success: false,
      status: 500,
    });
  });
});
