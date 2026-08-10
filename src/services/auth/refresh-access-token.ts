import type { JWT } from "next-auth/jwt";
import { apiRequest } from "@/services/api/client";
import type { AuthTokens } from "@/services/auth/parse-login";
import { getAccessTokenExpiresAt } from "@/services/auth/token-expiry";
import { REFRESH_TOKEN_ERROR } from "@/services/auth/refresh-constants";

export { REFRESH_TOKEN_ERROR };

/**
 * Call POST /user/rotate-token with the refresh token and return an updated JWT.
 * Keeps refresh token server-side only (never exposed on the session object).
 */
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return {
      ...token,
      error: REFRESH_TOKEN_ERROR,
    };
  }

  try {
    const response = await apiRequest<AuthTokens>("/user/rotate-token", {
      method: "POST",
      accessToken: token.refreshToken,
    });

    const access_token = response.data?.access_token;
    const refresh_token = response.data?.refresh_token;

    if (!access_token || !refresh_token) {
      return {
        ...token,
        error: REFRESH_TOKEN_ERROR,
      };
    }

    return {
      ...token,
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpires:
        getAccessTokenExpiresAt(access_token) ?? token.accessTokenExpires,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: REFRESH_TOKEN_ERROR,
    };
  }
}
