"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { AlertProvider } from "@/app/(auth)/alerts";
import TokenRefreshWatcher from "@/components/auth/TokenRefreshWatcher";

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
