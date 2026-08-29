import { describe, expect, it } from "vitest";
import {
  confirmEmailSchema,
  forgotPasswordSchema,
  googleAuthModeSchema,
  googleIdTokenSchema,
  loginSchema,
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.schema";

const VALID_PASSWORD = "Passw0rd!";

describe("signupSchema", () => {
  const valid = {
    fullname: "أحمد محمد",
    email: "user@example.com",
    password: VALID_PASSWORD,
    confirmPassword: VALID_PASSWORD,
  };

  it("accepts a valid signup payload and defaults role to 0", () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.role).toBe(0);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      ...valid,
      confirmPassword: "Passw0rd@",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak passwords", () => {
    expect(
      signupSchema.safeParse({ ...valid, password: "password", confirmPassword: "password" })
        .success,
    ).toBe(false);
  });

  it("trims email", () => {
    const result = signupSchema.safeParse({
      ...valid,
      email: "  user@example.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("user@example.com");
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({
        email: "user@example.com",
        password: VALID_PASSWORD,
      }).success,
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      loginSchema.safeParse({
        email: "not-an-email",
        password: VALID_PASSWORD,
      }).success,
    ).toBe(false);
  });
});

describe("confirmEmailSchema / resetPasswordSchema", () => {
  it("requires a 6-digit OTP", () => {
    expect(
      confirmEmailSchema.safeParse({
        email: "user@example.com",
        otp: "123456",
      }).success,
    ).toBe(true);
    expect(
      confirmEmailSchema.safeParse({
        email: "user@example.com",
        otp: "12345",
      }).success,
    ).toBe(false);
  });

  it("requires matching reset passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        email: "user@example.com",
        otp: "123456",
        password: VALID_PASSWORD,
        confirmPassword: VALID_PASSWORD,
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        email: "user@example.com",
        otp: "123456",
        password: VALID_PASSWORD,
        confirmPassword: "Other1!",
      }).success,
    ).toBe(false);
  });
});

describe("resendOtpSchema / forgotPasswordSchema", () => {
  it("accepts email only", () => {
    expect(resendOtpSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(
      true,
    );
  });
});

describe("google schemas", () => {
  it("requires a non-empty id token", () => {
    expect(googleIdTokenSchema.safeParse({ idToken: "abc" }).success).toBe(
      true,
    );
    expect(googleIdTokenSchema.safeParse({ idToken: "  " }).success).toBe(
      false,
    );
  });

  it("accepts continue and login modes", () => {
    expect(googleAuthModeSchema.safeParse("continue").success).toBe(true);
    expect(googleAuthModeSchema.safeParse("login").success).toBe(true);
    expect(googleAuthModeSchema.safeParse("other").success).toBe(false);
  });
});
