"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleLogin } from "@react-oauth/google";
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

  if (
    /audience|Wrong recipient|requiredAudience/i.test(decoded)
  ) {
    return "Client ID على الفرونت غير مطابق لإعداد Google في الـ backend. وحّد نفس NEXT_PUBLIC_GOOGLE_CLIENT_ID على الخادم ثم أعد المحاولة.";
  }

  return decoded;
}

/**
 * Uses Google Identity Services button (FedCM-ready via @react-oauth/google)
 * to get an ID Token, then exchanges it through NextAuth → backend.
 */
export default function GoogleAuthButton({
  mode,
  callbackUrl = "/profile",
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const safeCallback = safeInternalPath(callbackUrl, "/profile");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

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
        تسجيل الدخول عبر Google
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
      <div className="w-full overflow-hidden rounded-xl [&>div]:!w-full flex justify-center">
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
          useOneTap={false}
          theme="outline"
          size="large"
          text={mode === "login" ? "signin_with" : "continue_with"}
          shape="rectangular"
          width="384"
        />
      </div>
      {sessionMutation.isPending && (
        <p className="text-center text-xs font-bold text-text-muted">
          جاري التحقق من حساب Google...
        </p>
      )}
    </div>
  );
}
