"use client";

import { signOut, useSession } from "next-auth/react";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user = session?.user?.email
    ? {
        id: session.user.id,
        email: session.user.email,
        fullname: session.user.fullname || session.user.name || "",
      }
    : null;

  async function logout(callbackUrl = "/login") {
    clearLegacyAuthStorage();
    await signOut({ callbackUrl });
  }

  return {
    user,
    session,
    accessToken: session?.accessToken ?? null,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    update,
    logout,
  };
}
