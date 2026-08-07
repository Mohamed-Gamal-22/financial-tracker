"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../alerts";
import { forgotPassword, resetPassword } from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/schemas/auth.schema";

const RESEND_COOLDOWN_SECONDS = 300;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type ResetPasswordFormProps = {
  email: string;
  onBack: () => void;
};

export default function ResetPasswordForm({
  email,
  onBack,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldownLeft, setResendCooldownLeft] = useState(
    RESEND_COOLDOWN_SECONDS,
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (resendCooldownLeft <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldownLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldownLeft > 0]);

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      showAlert({
        message: response.message,
        success: response.success,
      });
      router.push("/login");
    },
    onError: (error) => {
      applyApiFieldErrors(error, setError);

      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message:
          error instanceof Error ? error.message : "فشل إعادة تعيين كلمة المرور",
        success: false,
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      showAlert({
        message: response.message,
        success: response.success,
      });
      setResendCooldownLeft(RESEND_COOLDOWN_SECONDS);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message:
          error instanceof Error ? error.message : "فشل إعادة إرسال الرمز",
        success: false,
      });
    },
  });

  const isResendDisabled =
    resendMutation.isPending || !email || resendCooldownLeft > 0;

  const passwordInputClass =
    "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-11 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all text-start";

  return (
    <form
      onSubmit={handleSubmit((values) =>
        resetMutation.mutate({
          ...values,
          email: email || values.email,
        }),
      )}
      className="space-y-4.5 text-start"
      noValidate
    >
      <input type="hidden" {...register("email")} />

      <div className="space-y-1.5">
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          رمز التحقق (OTP)
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-center text-lg tracking-[0.35em] font-bold text-text-main placeholder-text-muted outline-none transition-all"
          {...register("otp", {
            onChange: (event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
              setValue("otp", digits, { shouldValidate: true });
            },
          })}
        />
        {errors.otp && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          كلمة المرور الجديدة
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={passwordInputClass}
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

      <div className="space-y-1.5">
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          تأكيد كلمة المرور
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className={passwordInputClass}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={resetMutation.isPending}
        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <span>
          {resetMutation.isPending
            ? "جاري التحديث..."
            : "تغيير كلمة المرور"}
        </span>
      </button>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            if (!email || resendCooldownLeft > 0) return;
            resendMutation.mutate({ email });
          }}
          disabled={isResendDisabled}
          className="w-full py-2.5 border border-input-border rounded-xl bg-input-bg hover:bg-primary-light/10 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-bold text-text-main transition-colors cursor-pointer"
        >
          {resendMutation.isPending
            ? "جاري إعادة الإرسال..."
            : "إعادة إرسال رمز التحقق"}
        </button>
        {resendCooldownLeft > 0 && (
          <p className="text-center text-sm font-bold text-accent-danger tabular-nums">
            يمكنك إعادة الإرسال بعد {formatCountdown(resendCooldownLeft)}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm font-bold text-text-muted hover:text-primary transition-colors"
      >
        الرجوع لتعديل البريد
      </button>
    </form>
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
