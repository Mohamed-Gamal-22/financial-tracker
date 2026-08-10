import { getCsrfToken, getSession } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Force NextAuth to re-run the jwt callback with `forceTokenRotate`.
 * Used by the authed API interceptor after a 401 (and by the proactive watcher).
 */
export async function forceSessionTokenRotate(): Promise<Session | null> {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) {
    return getSession();
  }

  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      csrfToken,
      data: { forceTokenRotate: true },
    }),
  });

  return getSession();
}
