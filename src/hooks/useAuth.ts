"use client";

import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { clearLegacyAuthStorage } from "@/services/auth/session-utils";
import { logoutUser, type LogoutFlag } from "@/services/api/user";

type LogoutOptions = {
  flag?: LogoutFlag;
  callbackUrl?: string;
  /** Skip POST /user/logout (e.g. after freeze already invalidated the session). */
  skipApi?: boolean;
};

export function useAuth() {
  const { data: session, status, update } = useSession();
  const queryClient = useQueryClient();

  const user = session?.user?.email
    ? {
        id: session.user.id,
        email: session.user.email,
        fullname: session.user.fullname || session.user.name || "",
      }
    : null;

  async function logout(options: LogoutOptions | string = "/login") {
    const flag: LogoutFlag =
      typeof options === "string" ? "one" : (options.flag ?? "one");
    const callbackUrl =
      typeof options === "string" ? options : (options.callbackUrl ?? "/login");
    const skipApi = typeof options === "string" ? false : Boolean(options.skipApi);

    try {
      if (!skipApi && session?.accessToken) {
        await logoutUser(flag);
      }
    } catch {
      // Always clear the local session even if the API call fails.
    }

    queryClient.clear();
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
