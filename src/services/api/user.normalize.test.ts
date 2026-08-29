import { describe, expect, it } from "vitest";
import {
  normalizeProfilePicUploadUrl,
  normalizeUserProfile,
} from "./user";

describe("normalizeUserProfile", () => {
  it("reads nested user objects and alternate keys", () => {
    expect(
      normalizeUserProfile({
        user: {
          id: "u1",
          fullName: "أحمد محمد",
          email: "a@b.com",
          profile_pic: "//cdn.example.com/a.jpg",
        },
      }),
    ).toEqual({
      _id: "u1",
      fullname: "أحمد محمد",
      email: "a@b.com",
      profilePic: "https://cdn.example.com/a.jpg",
    });
  });

  it("returns null for bare envelopes", () => {
    expect(normalizeUserProfile({ success: true })).toBeNull();
    expect(normalizeUserProfile(null)).toBeNull();
  });

  it("falls back id to email when needed", () => {
    expect(
      normalizeUserProfile({ email: "only@x.com", name: "Only" }),
    ).toMatchObject({
      _id: "only@x.com",
      fullname: "Only",
      email: "only@x.com",
    });
  });
});

describe("normalizeProfilePicUploadUrl", () => {
  it("normalizes absolute, protocol-relative, and cloudinary hosts", () => {
    expect(normalizeProfilePicUploadUrl("https://x.com/a.jpg")).toBe(
      "https://x.com/a.jpg",
    );
    expect(normalizeProfilePicUploadUrl("//x.com/a.jpg")).toBe(
      "https://x.com/a.jpg",
    );
    expect(
      normalizeProfilePicUploadUrl("res.cloudinary.com/demo/image/upload/a.jpg"),
    ).toBe("https://res.cloudinary.com/demo/image/upload/a.jpg");
  });

  it("reads nested upload payload keys", () => {
    expect(
      normalizeProfilePicUploadUrl({ data: { secure_url: "https://x.com/a.png" } }),
    ).toBe("https://x.com/a.png");
    expect(normalizeProfilePicUploadUrl({})).toBeNull();
  });
});
