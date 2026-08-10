import { apiRequest } from "./client";
import { authedApiRequest } from "./authed-client";
import type { AuthTokens } from "@/services/auth/parse-login";

export type UserProfile = {
  _id: string;
  fullname: string;
  email: string;
};

export type LogoutFlag = "one" | "all";

/** GET /user */
export function getProfile() {
  return authedApiRequest<UserProfile>("/user", { method: "GET" });
}

/** POST /user/logout — `one` = this device, `all` = every device */
export function logoutUser(flag: LogoutFlag = "one") {
  return authedApiRequest("/user/logout", {
    method: "POST",
    body: JSON.stringify({ flag }),
  });
}

/** DELETE /user/freeze — soft-delete account */
export function freezeAccount() {
  return authedApiRequest("/user/freeze", { method: "DELETE" });
}

/**
 * POST /user/rotate-token
 * Authorization must be the refresh token (not access).
 * Prefer server-side rotation via NextAuth jwt callback / refreshAccessToken —
 * this helper is for direct calls when a refresh token string is already available.
 */
export function rotateToken(refreshToken: string) {
  return apiRequest<AuthTokens>("/user/rotate-token", {
    method: "POST",
    accessToken: refreshToken,
  });
}
