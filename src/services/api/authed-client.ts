import { isAuthFailureError } from "@/services/auth/auth-failure";
import { REFRESH_TOKEN_ERROR } from "@/services/auth/refresh-constants";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";
import {
  isAccessTokenExpired,
  resolveAccessTokenExpiresAt,
  shouldRotateAccessToken,
} from "@/services/auth/token-expiry";
import { forceSessionTokenRotate } from "@/services/auth/force-session-rotate";
import { getSession, signOut } from "next-auth/react";
import { apiRequest, cloneFormData, type ApiRequestOptions } from "./client";
import type { ApiResponse } from "./types";

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

function tokenNeedsRotation(session: {
  accessToken?: string;
  accessTokenExpires?: number;
}) {
  const expiresAt = resolveAccessTokenExpiresAt(
    session.accessToken,
    session.accessTokenExpires,
  );

  return (
    shouldRotateAccessToken(expiresAt) ||
    isAccessTokenExpired(session.accessToken, expiresAt)
  );
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

    if (session?.accessToken && !tokenNeedsRotation(session)) {
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
 * - On auth failure (401/403 or "jwt expired"): force rotate once, then retry
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
    if (!isAuthFailureError(error)) {
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
