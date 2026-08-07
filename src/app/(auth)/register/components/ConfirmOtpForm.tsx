"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../alerts";
import { confirmEmail, resendOtp } from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import {
  confirmEmailSchema,
  type ConfirmEmailInput,
} from "@/schemas/auth.schema";

const RESEND_COOLDOWN_SECONDS = 300;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type ConfirmOtpFormProps = {
  email: string;
  onBack: () => void;
};

export default function ConfirmOtpForm({ email, onBack }: ConfirmOtpFormProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [resendCooldownLeft, setResendCooldownLeft] = useState(
    RESEND_COOLDOWN_SECONDS,
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ConfirmEmailInput>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  useEffect(() => {
    if (resendCooldownLeft <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldownLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldownLeft > 0]);

  const confirmMutation = useMutation({
    mutationFn: confirmEmail,
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
        message: error instanceof Error ? error.message : "فشل تأكيد الرمز",
        success: false,
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
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

  return (
    <form
      onSubmit={handleSubmit((values) =>
        confirmMutation.mutate({
          email: email || values.email,
          otp: values.otp,
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

      <button
        type="submit"
        disabled={confirmMutation.isPending}
        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <span>
          {confirmMutation.isPending ? "جاري التحقق..." : "تأكيد الرمز"}
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
        الرجوع لتعديل البيانات
      </button>
    </form>
  );
}
