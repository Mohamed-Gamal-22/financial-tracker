import { describe, expect, it } from "vitest";
import {
  ACCESS_TOKEN_ROTATE_WINDOW_MS,
  getAccessTokenExpiresAt,
  isAccessTokenExpired,
  msUntilRotateWindow,
  resolveAccessTokenExpiresAt,
  shouldRotateAccessToken,
} from "./token-expiry";

function jwtWithExp(expSeconds: number) {
  const header = Buffer.from(
    JSON.stringify({ alg: "none", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds })).toString(
    "base64url",
  );
  return `${header}.${payload}.sig`;
}

describe("token-expiry", () => {
  const now = 1_700_000_000_000;

  it("reads exp from JWT access tokens", () => {
    const token = jwtWithExp(1_700_000_100);
    expect(getAccessTokenExpiresAt(token)).toBe(1_700_000_100_000);
    expect(getAccessTokenExpiresAt("not.a.jwt")).toBeNull();
  });

  it("prefers stored expiry over JWT parsing", () => {
    expect(resolveAccessTokenExpiresAt("ignored", 123)).toBe(123);
    expect(resolveAccessTokenExpiresAt(null, null)).toBeNull();
    expect(
      resolveAccessTokenExpiresAt(jwtWithExp(1_700_000_100), null),
    ).toBe(1_700_000_100_000);
  });

  it("rotates when within the 5-minute window", () => {
    expect(shouldRotateAccessToken(null, now)).toBe(false);
    expect(
      shouldRotateAccessToken(now + ACCESS_TOKEN_ROTATE_WINDOW_MS, now),
    ).toBe(true);
    expect(
      shouldRotateAccessToken(now + ACCESS_TOKEN_ROTATE_WINDOW_MS + 1, now),
    ).toBe(false);
    expect(shouldRotateAccessToken(now - 1, now)).toBe(true);
  });

  it("detects expired tokens", () => {
    expect(isAccessTokenExpired(null, now - 1, now)).toBe(true);
    expect(isAccessTokenExpired(null, now + 1, now)).toBe(false);
    expect(isAccessTokenExpired(null, null, now)).toBe(false);
  });

  it("clamps msUntilRotateWindow to zero inside the window", () => {
    expect(msUntilRotateWindow(null, now)).toBeNull();
    expect(msUntilRotateWindow(now + ACCESS_TOKEN_ROTATE_WINDOW_MS, now)).toBe(
      0,
    );
    expect(
      msUntilRotateWindow(now + ACCESS_TOKEN_ROTATE_WINDOW_MS + 5000, now),
    ).toBe(5000);
  });
});
