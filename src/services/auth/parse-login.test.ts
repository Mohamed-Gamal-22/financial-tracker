import { describe, expect, it } from "vitest";
import { displayNameFromEmail, parseLoginData } from "./parse-login";

describe("displayNameFromEmail", () => {
  it("title-cases the local part", () => {
    expect(displayNameFromEmail("john.doe@example.com")).toBe("John Doe");
    expect(displayNameFromEmail("user_name-test@x.com")).toBe("User Name Test");
  });
});

describe("parseLoginData", () => {
  it("parses snake_case tokens", () => {
    const result = parseLoginData(
      {
        access_token: "a",
        refresh_token: "r",
        fullname: "أحمد محمد",
        email: "a@b.com",
      },
      "fallback@x.com",
    );
    expect(result).toEqual({
      tokens: { access_token: "a", refresh_token: "r" },
      user: { fullname: "أحمد محمد", email: "a@b.com" },
    });
  });

  it("parses camelCase tokens and nested user", () => {
    const result = parseLoginData(
      {
        accessToken: "a",
        refreshToken: "r",
        user: { name: "Nested", email: "n@x.com" },
      },
      "fallback@x.com",
    );
    expect(result?.user).toEqual({ fullname: "Nested", email: "n@x.com" });
  });

  it("returns null when tokens are missing", () => {
    expect(parseLoginData({ access_token: "a" }, "e@x.com")).toBeNull();
    expect(parseLoginData(null, "e@x.com")).toBeNull();
  });

  it("uses preferredFullname and email fallbacks", () => {
    const result = parseLoginData(
      { access_token: "a", refresh_token: "r" },
      "jane.doe@x.com",
      "Preferred Name",
    );
    expect(result?.user).toEqual({
      fullname: "Preferred Name",
      email: "jane.doe@x.com",
    });
  });
});
