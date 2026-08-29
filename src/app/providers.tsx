"use client";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { AlertProvider } from "@/app/(auth)/alerts";
import TokenRefreshWatcher from "@/components/auth/TokenRefreshWatcher";

function UserSessionQuerySync() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const currentUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const currentEmail = session?.user?.email?.toLowerCase().trim() ?? null;
    if (currentUserRef.current !== null && currentUserRef.current !== currentEmail) {
      queryClient.clear();
    }
    currentUserRef.current = currentEmail;
  }, [session?.user?.email, status, queryClient]);

  return null;
}

function GoogleProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

  // Still mount children when unset so the rest of the app works;
  // GoogleAuthButton shows a clear error if the user clicks without a client id.
  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId} locale="ar">
      {children}
    </GoogleOAuthProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus>
      <QueryClientProvider client={queryClient}>
        <UserSessionQuerySync />
        <GoogleProvider>
          <AlertProvider>
            <TokenRefreshWatcher />
            {children}
          </AlertProvider>
        </GoogleProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
