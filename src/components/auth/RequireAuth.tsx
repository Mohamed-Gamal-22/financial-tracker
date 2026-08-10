"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-start to-bg-end">
        <p className="text-sm font-bold text-text-muted">جاري التحميل...</p>
      </div>
    );
  }

  return <>{children}</>;
}
