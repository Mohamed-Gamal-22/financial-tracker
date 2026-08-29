"use client";

import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import type { GoogleAuthMode } from "@/schemas/auth.schema";

type AuthDividerWithGoogleProps = {
  mode: GoogleAuthMode;
  callbackUrl?: string;
  label?: string;
};

/** Shared "أو" divider + Google auth button for login / register forms. */
export default function AuthDividerWithGoogle({
  mode,
  callbackUrl,
  label,
}: AuthDividerWithGoogleProps) {
  return (
    <div className="space-y-4 mt-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-input-border" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
          أو
        </span>
        <div className="h-px flex-1 bg-input-border" />
      </div>
      <GoogleAuthButton mode={mode} callbackUrl={callbackUrl} label={label} />
    </div>
  );
}
