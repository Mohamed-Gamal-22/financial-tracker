import { REFRESH_TOKEN_ERROR } from "@/services/auth/refresh-constants";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";
import { shouldRotateAccessToken } from "@/services/auth/token-expiry";
import { forceSessionTokenRotate } from "@/services/auth/force-session-rotate";
import { getSession, signOut } from "next-auth/react";
import { apiRequest, cloneFormData, type ApiRequestOptions } from "./client";
import { ApiError, type ApiResponse } from "./types";

/** Deduplicate concurrent rotate/refresh calls from parallel API requests. */
let refreshInFlight: Promise<string | null> | null = null;

async function signOutAfterRefreshFailure() {
  clearLegacyAuthStorage();
  await signOut({ callbackUrl: "/login" });
}

async function getAccessTokenFromSession() {
  const session = await getSession();

  if (session?.error === REFRESH_TOKEN_ERROR) {
    await signOutAfterRefreshFailure();
    return null;
  }

  return session?.accessToken ?? null;
}

/**
 * Ensure we have a usable access token.
 * Proactively rotates via NextAuth jwt callback when ≤ 5 minutes remain.
 */
async function ensureAccessToken(options?: {
  forceRotate?: boolean;
}): Promise<string | null> {
  if (!options?.forceRotate) {
    const session = await getSession();

    if (session?.error === REFRESH_TOKEN_ERROR) {
      await signOutAfterRefreshFailure();
      return null;
    }

    if (
      session?.accessToken &&
      !shouldRotateAccessToken(session.accessTokenExpires)
    ) {
      return session.accessToken;
    }
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const rotated = await forceSessionTokenRotate();

        if (rotated?.error === REFRESH_TOKEN_ERROR) {
          await signOutAfterRefreshFailure();
          return null;
        }

        return rotated?.accessToken ?? (await getAccessTokenFromSession());
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

/**
 * Client-side authenticated request with token interceptors:
 * - Proactive rotate when access token is within 5 minutes of expiry
 * - On 401: force rotate once, then retry the original request
 */
export async function authedApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const accessToken = await ensureAccessToken();

  if (!accessToken) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  const buildBody = () =>
    typeof FormData !== "undefined" && options.body instanceof FormData
      ? cloneFormData(options.body)
      : options.body;

  try {
    return await apiRequest<T>(path, {
      ...options,
      body: buildBody(),
      accessToken,
    });
  } catch (error) {
    const isUnauthorized =
      error instanceof ApiError && error.status === 401;

    if (!isUnauthorized) {
      throw error;
    }

    const freshToken = await ensureAccessToken({ forceRotate: true });

    if (!freshToken || freshToken === accessToken) {
      await signOutAfterRefreshFailure();
      throw error;
    }

    return apiRequest<T>(path, {
      ...options,
      body: buildBody(),
      accessToken: freshToken,
    });
  }
}
