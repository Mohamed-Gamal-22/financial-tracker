"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../alerts";
import { consumePendingFullname } from "@/services/auth/pending-name";
import {
  clearLegacyAuthStorage,
  safeInternalPath,
} from "@/services/auth/session-utils";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import AuthDividerWithGoogle from "@/components/auth/AuthDividerWithGoogle";

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
    return "بيانات الدخول غير صحيحة";
  }
  try {
    return decodeURIComponent(error);
  } catch {
    return error;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = safeInternalPath(
    searchParams.get("callbackUrl") ?? searchParams.get("next"),
    "/dashboard",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    showAlert({
      message: resolveSignInError(error),
      success: false,
    });
  }, [searchParams, showAlert]);

  const loginMutation = useMutation({
    mutationFn: async (values: LoginInput) => {
      const pendingName = consumePendingFullname(values.email);

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        fullname: pendingName ?? "",
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        throw new Error("تعذر الاتصال بخدمة المصادقة");
      }

      return result;
    },
    onSuccess: (result) => {
      // NextAuth can return ok:false with a custom or empty error — never treat as success.
      if (!result.ok || result.error) {
        showAlert({
          message: resolveSignInError(result.error),
          success: false,
        });
        return;
      }

      clearLegacyAuthStorage();
      showAlert({
        message: "تم تسجيل الدخول بنجاح",
        success: true,
      });
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error) => {
      showAlert({
        message: error instanceof Error ? error.message : "فشل تسجيل الدخول",
        success: false,
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        className="space-y-5 text-start"
        noValidate
      >
      <div className="space-y-1.5">
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
            كلمة المرور
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary-hover text-xs font-bold transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-11 py-3 text-sm text-text-main placeholder-text-muted outline-none transition-all text-start"
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>
          {loginMutation.isPending
            ? "جاري تسجيل الدخول..."
            : "تسجيل الدخول إلى الحساب"}
        </span>
      </button>
      </form>

      <AuthDividerWithGoogle mode="continue" callbackUrl={callbackUrl} />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}
