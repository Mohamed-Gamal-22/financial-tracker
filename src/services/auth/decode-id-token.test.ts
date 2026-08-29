import { describe, expect, it } from "vitest";
import {
  decodeJwtPayload,
  emailFromGoogleIdToken,
  nameFromGoogleIdToken,
} from "./decode-id-token";

function makeJwt(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: "none" })).toString(
    "base64url",
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.sig`;
}

describe("decodeJwtPayload", () => {
  it("decodes base64url payloads", () => {
    const token = makeJwt({ email: "a@b.com", exp: 123 });
    expect(decodeJwtPayload(token)).toEqual({ email: "a@b.com", exp: 123 });
  });

  it("returns null for truncated or invalid tokens", () => {
    expect(decodeJwtPayload("onlyone")).toBeNull();
    expect(decodeJwtPayload("a.%%%.c")).toBeNull();
  });
});

describe("google id token helpers", () => {
  it("reads email and name claims", () => {
    const token = makeJwt({
      email: "a@b.com",
      name: "  Full Name  ",
    });
    expect(emailFromGoogleIdToken(token)).toBe("a@b.com");
    expect(nameFromGoogleIdToken(token)).toBe("Full Name");
  });

  it("falls back to given + family name", () => {
    const token = makeJwt({
      given_name: "John",
      family_name: "Doe",
    });
    expect(nameFromGoogleIdToken(token)).toBe("John Doe");
    expect(emailFromGoogleIdToken(token)).toBe("");
  });
});
