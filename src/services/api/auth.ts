import type {
  ConfirmEmailInput,
  ForgotPasswordInput,
  GoogleIdTokenInput,
  LoginInput,
  ResendOtpInput,
  ResetPasswordInput,
  SignupInput,
} from "@/schemas/auth.schema";
import { apiRequest, withLangQuery } from "./client";
import type { AuthTokens } from "@/services/auth/parse-login";

/** POST /auth/signup?lang=ar — normal clients must not send `role`. */
export function signup(body: SignupInput) {
  const { role: _role, ...payload } = body;
  return apiRequest(withLangQuery("/auth/signup"), {
    method: "POST",
    body: JSON.stringify(payload),
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

/** POST /auth/login?lang=ar */
export function login(body: LoginInput) {
  return apiRequest<LoginResponseData>(withLangQuery("/auth/login"), {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/confirm-email?lang=ar */
export function confirmEmail(body: ConfirmEmailInput) {
  return apiRequest(withLangQuery("/auth/confirm-email"), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/resend-otp?lang=ar */
export function resendOtp(body: ResendOtpInput) {
  return apiRequest(withLangQuery("/auth/resend-otp"), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** POST /auth/forgot-password-otp?lang=ar */
export function forgotPassword(body: ForgotPasswordInput) {
  return apiRequest(withLangQuery("/auth/forgot-password-otp"), {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PATCH /auth/reset-password?lang=ar */
export function resetPassword(body: ResetPasswordInput) {
  return apiRequest(withLangQuery("/auth/reset-password"), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** POST /auth/gmail?lang=ar — Continue with Google (sign up or login) */
export function continueWithGoogle(body: GoogleIdTokenInput) {
  return apiRequest<LoginResponseData>(withLangQuery("/auth/gmail"), {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** @deprecated Use continueWithGoogle — master doc uses /auth/gmail only */
export function loginWithGmail(body: GoogleIdTokenInput) {
  return continueWithGoogle(body);
}
