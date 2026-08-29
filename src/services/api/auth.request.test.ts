import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({
  apiRequest: vi.fn(),
  withLangQuery: (path: string) => `${path}?lang=ar`,
}));

import { apiRequest } from "./client";
import {
  confirmEmail,
  continueWithGoogle,
  forgotPassword,
  login,
  loginWithGmail,
  resendOtp,
  resetPassword,
  signup,
} from "./auth";

describe("auth API wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiRequest).mockResolvedValue({
      message: "ok",
      success: true,
      status: 200,
    });
  });

  it("signup strips role from the payload", async () => {
    await signup({
      fullname: "أحمد محمد",
      email: "a@b.com",
      password: "Passw0rd!",
      confirmPassword: "Passw0rd!",
      role: 0,
    });
    expect(apiRequest).toHaveBeenCalledWith("/auth/signup?lang=ar", {
      method: "POST",
      body: JSON.stringify({
        fullname: "أحمد محمد",
        email: "a@b.com",
        password: "Passw0rd!",
        confirmPassword: "Passw0rd!",
      }),
    });
  });

  it("calls login / confirm / resend / forgot / reset endpoints", async () => {
    await login({ email: "a@b.com", password: "Passw0rd!" });
    await confirmEmail({ email: "a@b.com", otp: "123456" });
    await resendOtp({ email: "a@b.com" });
    await forgotPassword({ email: "a@b.com" });
    await resetPassword({
      email: "a@b.com",
      otp: "123456",
      password: "Passw0rd!",
      confirmPassword: "Passw0rd!",
    });

    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/login?lang=ar",
      expect.objectContaining({ method: "POST" }),
    );
    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/confirm-email?lang=ar",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/resend-otp?lang=ar",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/forgot-password-otp?lang=ar",
      expect.objectContaining({ method: "POST" }),
    );
    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/reset-password?lang=ar",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("continueWithGoogle and loginWithGmail hit /auth/gmail", async () => {
    await continueWithGoogle({ idToken: "tok" });
    await loginWithGmail({ idToken: "tok" });
    expect(apiRequest).toHaveBeenCalledWith("/auth/gmail?lang=ar", {
      method: "POST",
      body: JSON.stringify({ idToken: "tok" }),
    });
    expect(apiRequest).toHaveBeenCalledTimes(2);
  });
});
