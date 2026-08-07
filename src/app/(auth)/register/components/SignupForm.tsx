"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../../alerts";
import { signup } from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import { rememberPendingFullname } from "@/services/auth/pending-name";
import {
  signupSchema,
  type SignupFormValues,
  type SignupInput,
} from "@/schemas/auth.schema";

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

const passwordInputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-11 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all text-start";

type SignupFormProps = {
  onSuccess: (email: string) => void;
};

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues, unknown, SignupInput>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 0,
    },
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (response, variables) => {
      rememberPendingFullname(variables.email, variables.fullname);
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
        message: error instanceof Error ? error.message : "فشل إنشاء الحساب",
        success: false,
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => signupMutation.mutate(values))}
      className="space-y-4.5 text-start"
      noValidate
    >
      <div className="space-y-1.5">
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          الاسم بالكامل
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="First Last"
            className={inputClass}
            {...register("fullname")}
          />
        </div>
        {errors.fullname && (
          <p className="text-accent-danger text-xs font-medium">
            {errors.fullname.message}
          </p>
        )}
      </div>

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
            className={inputClass}
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
        <label className="text-text-main text-xs font-bold uppercase tracking-wider block">
          كلمة المرور
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
        disabled={signupMutation.isPending}
        className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <span>
          {signupMutation.isPending ? "جاري الإنشاء..." : "إنشاء الحساب الجديد"}
        </span>
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
