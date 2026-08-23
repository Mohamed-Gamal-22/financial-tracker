import { getCsrfToken, getSession } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Force NextAuth to re-run the jwt callback with `forceTokenRotate`.
 * Used by the authed API interceptor after auth failures (and by the proactive watcher).
 */
export async function forceSessionTokenRotate(): Promise<Session | null> {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) {
    return getSession();
  }

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      csrfToken,
      data: { forceTokenRotate: true },
    }),
  });

  if (!response.ok) {
    return getSession();
  }

  let session: Session | null = null;
  try {
    session = (await response.json()) as Session | null;
  } catch {
    session = await getSession();
  }

  // Keep SessionProvider tabs in sync with the rotated cookie.
  await getSession({ broadcast: true });

  return session;
}
