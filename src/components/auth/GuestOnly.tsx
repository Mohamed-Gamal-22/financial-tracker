"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/** Redirects authenticated users away from guest-only auth pages. */
export default function GuestOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/profile");
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
