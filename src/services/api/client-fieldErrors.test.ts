import { describe, expect, it, vi } from "vitest";
import { withLangQuery, cloneFormData } from "./client";
import {
  applyApiFieldErrors,
  formatApiErrorMessage,
} from "./fieldErrors";
import { ApiError } from "./types";

describe("withLangQuery", () => {
  it("appends or overrides lang", () => {
    expect(withLangQuery("/user")).toBe("/user?lang=ar");
    expect(withLangQuery("/user?page=1")).toBe("/user?page=1&lang=ar");
    expect(withLangQuery("/user?lang=en")).toBe("/user?lang=ar");
    expect(withLangQuery("/user", "en")).toBe("/user?lang=en");
  });
});

describe("cloneFormData", () => {
  it("preserves File filenames", () => {
    const file = new File(["x"], "avatar.png", { type: "image/png" });
    const source = new FormData();
    source.append("file", file);
    source.append("note", "hi");

    const cloned = cloneFormData(source);
    const clonedFile = cloned.get("file");
    expect(clonedFile).toBeInstanceOf(File);
    expect((clonedFile as File).name).toBe("avatar.png");
    expect(cloned.get("note")).toBe("hi");
  });
});

describe("formatApiErrorMessage / applyApiFieldErrors", () => {
  it("formats grouped and map-style validation errors", () => {
    const grouped = new ApiError({
      message: "فشل",
      success: false,
      status: 400,
      errors: [
        {
          key: "body",
          issues: [{ path: "user.email", message: "غير صالح" }],
        },
      ],
    });
    expect(formatApiErrorMessage(grouped)).toBe("فشل: user.email: غير صالح");

    const mapped = new ApiError({
      message: "فشل",
      success: false,
      status: 400,
      errors: { email: "مطلوب", title: ["قصير"] },
    });
    expect(formatApiErrorMessage(mapped)).toContain("مطلوب");
    expect(formatApiErrorMessage(mapped)).toContain("قصير");
  });

  it("returns Error message or fallback for non-ApiError", () => {
    expect(formatApiErrorMessage(new Error("boom"))).toBe("boom");
    expect(formatApiErrorMessage("x", "fallback")).toBe("fallback");
  });

  it("applies field errors onto RHF setError", () => {
    const setError = vi.fn();
    const applied = applyApiFieldErrors(
      new ApiError({
        message: "فشل",
        success: false,
        status: 400,
        errors: [
          {
            key: "body",
            issues: [{ path: "data.title", message: "مطلوب" }],
          },
        ],
      }),
      setError,
    );
    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledWith("title", {
      type: "server",
      message: "مطلوب",
    });
    expect(applyApiFieldErrors(new Error("x"), setError)).toBe(false);
  });
});
