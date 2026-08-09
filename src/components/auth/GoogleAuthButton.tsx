"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import type { GoogleAuthMode } from "@/schemas/auth.schema";
import {
  clearLegacyAuthStorage,
  safeInternalPath,
} from "@/services/auth/session-utils";

type GoogleAuthButtonProps = {
  /** `continue` → POST /auth/gmail | `login` → POST /auth/login/gmail */
  mode: GoogleAuthMode;
  callbackUrl?: string;
};

const NEXTAUTH_GENERIC_ERRORS = new Set([
  "CredentialsSignin",
  "OAuthSignin",
  "OAuthCallback",
  "OAuthCreateAccount",
  "EmailCreateAccount",
  "Callback",
  "OAuthAccountNotLinked",
  "EmailSignin",
  "SessionRequired",
  "Default",
]);

function resolveSignInError(error?: string | null) {
  if (!error || NEXTAUTH_GENERIC_ERRORS.has(error)) {
    return "فشل تسجيل الدخول عبر Google";
  }

  let decoded = error;
  try {
    decoded = decodeURIComponent(error);
  } catch {
    // keep raw
  }

  if (/audience|Wrong recipient|requiredAudience/i.test(decoded)) {
    return "Client ID على الفرونت غير مطابق لإعداد Google في الـ backend. وحّد نفس NEXT_PUBLIC_GOOGLE_CLIENT_ID على الخادم ثم أعد المحاولة.";
  }

  if (/origin_mismatch/i.test(decoded)) {
    return "مصدر الموقع غير مسجّل في Google Cloud (Authorized JavaScript origins). أضف http://localhost:3000 للتجربة المحلية.";
  }

  return decoded;
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function disableGoogleAutoSelect() {
  googleLogout();
  try {
    (
      window as Window & {
        google?: { accounts?: { id?: { disableAutoSelect?: () => void } } };
      }
    ).google?.accounts?.id?.disableAutoSelect?.();
  } catch {
    // GIS may not be ready yet
  }
}

/**
 * Custom-looking Google button (Arabic label) over an invisible GIS button.
 * Official GIS personalizes with the signed-in email — we hide that and always
 * show "تسجيل بالجيميل", then open Google's account chooser on click.
 */
export default function GoogleAuthButton({
  mode,
  callbackUrl = "/profile",
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const safeCallback = safeInternalPath(callbackUrl, "/profile");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(320);

  const label =
    mode === "login" ? "تسجيل الدخول بالجيميل" : "التسجيل بالجيميل";

  useEffect(() => {
    disableGoogleAutoSelect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const syncWidth = () => {
      const next = Math.max(240, Math.floor(el.getBoundingClientRect().width));
      setButtonWidth(next);
    };

    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sessionMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const result = await signIn("google-id-token", {
        idToken,
        mode,
        redirect: false,
        callbackUrl: safeCallback,
      });

      if (!result) {
        throw new Error("تعذر الاتصال بخدمة المصادقة");
      }

      return result;
    },
    onSuccess: (result) => {
      if (!result.ok || result.error) {
        showAlert({
          message: resolveSignInError(result.error),
          success: false,
        });
        return;
      }

      clearLegacyAuthStorage();
      showAlert({
        message: "تم تسجيل الدخول عبر Google بنجاح",
        success: true,
      });
      router.push(safeCallback);
      router.refresh();
    },
    onError: (error) => {
      showAlert({
        message:
          error instanceof Error
            ? resolveSignInError(error.message)
            : "فشل تسجيل الدخول عبر Google",
        success: false,
      });
    },
  });

  if (!clientId) {
    return (
      <button
        type="button"
        onClick={() =>
          showAlert({
            message:
              "إعداد Google غير مكتمل. أضف NEXT_PUBLIC_GOOGLE_CLIENT_ID إلى ملف البيئة.",
            success: false,
          })
        }
        className="w-full py-3 border border-input-border rounded-xl bg-input-bg text-sm font-bold text-text-main"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
      <div
        ref={containerRef}
        className="relative w-full h-12 rounded-xl overflow-hidden"
      >
        {/* Visible branded control — Google iframe stays clickable on top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-3 border border-input-border rounded-xl bg-input-bg text-sm font-bold text-text-main"
        >
          <GoogleGlyph />
          <span>{label}</span>
        </div>

        <div
          className="absolute inset-0 z-10 opacity-0 [&_div]:!w-full [&_div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full"
          title={label}
        >
          <GoogleLogin
            onSuccess={(response) => {
              if (!response.credential) {
                showAlert({
                  message: "لم يتم استلام رمز Google",
                  success: false,
                });
                return;
              }
              sessionMutation.mutate(response.credential);
            }}
            onError={() => {
              showAlert({
                message: "تم إلغاء أو فشل تسجيل الدخول عبر Google",
                success: false,
              });
            }}
            click_listener={disableGoogleAutoSelect}
            useOneTap={false}
            auto_select={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width={buttonWidth}
          />
        </div>
      </div>
      {sessionMutation.isPending && (
        <p className="text-center text-xs font-bold text-text-muted">
          جاري التحقق من حساب Google...
        </p>
      )}
    </div>
  );
}
