import { decodeJwtPayload } from "./decode-id-token";

/** Backend allows rotate only when access token has ≤ 5 minutes left (incl. expired). */
export const ACCESS_TOKEN_ROTATE_WINDOW_MS = 5 * 60 * 1000;

/** Read `exp` from a JWT access token and return expiry in milliseconds. */
export function getAccessTokenExpiresAt(accessToken: string): number | null {
  const payload = decodeJwtPayload(accessToken);
  const exp = payload?.exp;
  if (typeof exp !== "number" || !Number.isFinite(exp)) return null;
  return exp * 1000;
}

/** True when remaining lifetime is 5 minutes or less (or already expired). */
export function shouldRotateAccessToken(
  expiresAt: number | null | undefined,
  now = Date.now(),
): boolean {
  if (expiresAt == null) return false;
  return expiresAt - now <= ACCESS_TOKEN_ROTATE_WINDOW_MS;
}

/** Milliseconds until we enter the rotate window (0 if already inside / past). */
export function msUntilRotateWindow(
  expiresAt: number | null | undefined,
  now = Date.now(),
): number | null {
  if (expiresAt == null) return null;
  return Math.max(expiresAt - ACCESS_TOKEN_ROTATE_WINDOW_MS - now, 0);
}
