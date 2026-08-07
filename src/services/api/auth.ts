import type {
  ConfirmEmailInput,
  ForgotPasswordInput,
  LoginInput,
  ResendOtpInput,
  ResetPasswordInput,
  SignupInput,
} from "@/schemas/auth.schema";
import { apiRequest } from "./client";
import type { AuthTokens } from "@/services/auth/parse-login";

/** POST /auth/signup */
export function signup(body: SignupInput) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** Login payload may include tokens plus optional user fields. */
export type LoginResponseData = AuthTokens & {
  fullname?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    fullname?: string;
    name?: string;
    email?: string;
  };
};

/** POST /auth/login */
export function login(body: LoginInput) {
  return apiRequest<LoginResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/confirm-email */
export function confirmEmail(body: ConfirmEmailInput) {
  return apiRequest("/auth/confirm-email", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/resend-otp */
export function resendOtp(body: ResendOtpInput) {
  return apiRequest("/auth/resend-otp", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** POST /auth/forgot-password-otp */
export function forgotPassword(body: ForgotPasswordInput) {
  return apiRequest("/auth/forgot-password-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/reset-password */
export function resetPassword(body: ResetPasswordInput) {
  return apiRequest("/auth/reset-password", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
