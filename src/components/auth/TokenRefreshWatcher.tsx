"use client";

import { REFRESH_TOKEN_ERROR } from "@/services/auth/refresh-constants";
import { msUntilRotateWindow } from "@/services/auth/token-expiry";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * Proactively rotates the access token when it enters the ≤5-minute window,
 * and signs the user out if refresh permanently fails.
 */
export default function TokenRefreshWatcher() {
  const { data: session, status, update } = useSession();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (session?.error !== REFRESH_TOKEN_ERROR) return;

    clearLegacyAuthStorage();
    void signOut({ callbackUrl: "/login" });
  }, [session?.error]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (status !== "authenticated" || !session?.accessTokenExpires) {
      return;
    }

    if (session.error === REFRESH_TOKEN_ERROR) {
      return;
    }

    const delay = msUntilRotateWindow(session.accessTokenExpires);
    if (delay == null) return;

    timerRef.current = setTimeout(() => {
      void update({ forceTokenRotate: true });
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    session?.accessTokenExpires,
    session?.error,
    status,
    update,
  ]);

  return null;
}
