"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../alerts";
import { forgotPassword } from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth.schema";

type ForgotPasswordFormProps = {
  onSuccess: (email: string) => void;
};

export default function ForgotPasswordForm({
  onSuccess,
}: ForgotPasswordFormProps) {
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response, variables) => {
      showAlert({
        message: response.message,
        success: response.success,
      });
      onSuccess(variables.email);
    },
    onError: (error) => {
      applyApiFieldErrors(error, setError);

      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message:
          error instanceof Error ? error.message : "فشل إرسال رمز التحقق",
        success: false,
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => forgotMutation.mutate(values))}
      className="space-y-4.5 text-start"
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
            className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={forgotMutation.isPending}
        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <span>
          {forgotMutation.isPending ? "جاري الإرسال..." : "إرسال رمز التحقق"}
        </span>
      </button>
    </form>
  );
}
