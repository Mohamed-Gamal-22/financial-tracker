import { describe, expect, it } from "vitest";
import { clearLegacyAuthStorage, safeInternalPath } from "./session-utils";

describe("safeInternalPath", () => {
  it("allows relative same-origin paths", () => {
    expect(safeInternalPath("/dashboard")).toBe("/dashboard");
    expect(safeInternalPath("/transactions?x=1")).toBe("/transactions?x=1");
  });

  it("rejects open redirects and falls back", () => {
    expect(safeInternalPath("//evil.com")).toBe("/dashboard");
    expect(safeInternalPath("/\\evil")).toBe("/dashboard");
    expect(safeInternalPath("https://evil.com")).toBe("/dashboard");
    expect(safeInternalPath(null, "/login")).toBe("/login");
    expect(safeInternalPath("")).toBe("/dashboard");
  });
});

describe("clearLegacyAuthStorage", () => {
  it("removes legacy keys and auth cookie", () => {
    localStorage.setItem("access_token", "a");
    localStorage.setItem("refresh_token", "r");
    localStorage.setItem("auth_user", "{}");
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "auth_session=1",
    });

    clearLegacyAuthStorage();

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(document.cookie).toContain("auth_session=");
  });
});
