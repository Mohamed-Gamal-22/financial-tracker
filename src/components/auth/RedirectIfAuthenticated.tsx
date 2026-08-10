"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/** Sends logged-in users to profile instead of guest marketing pages. */
export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-start to-bg-end">
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
