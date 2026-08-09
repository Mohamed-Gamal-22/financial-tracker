import { z } from "zod";

/** 1. POST /auth/signup */
export const signupSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .regex(/^[A-Za-z]+ [A-Za-z]+$/, {
        message:
          "الاسم يجب أن يكون كلمتين فقط مفصولتين بمسافة واحدة، وبحروف إنجليزية فقط",
      }),
    email: z
      .string()
      .trim()
      .email({ message: "البريد الإلكتروني غير صالح" }),
    password: z
      .string()
      .min(8, { message: "كلمة المرور يجب ألا تقل عن 8 أحرف" })
      .regex(/[A-Z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
      })
      .regex(/[a-z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
      })
      .regex(/[0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "كلمة المرور يجب ألا تقل عن 8 أحرف" })
      .regex(/[A-Z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
      })
      .regex(/[a-z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
      })
      .regex(/[0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
      }),
    role: z.union([z.literal(0), z.literal(1)]).optional().default(0),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

/** 2. POST /auth/login */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "البريد الإلكتروني غير صالح" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب ألا تقل عن 8 أحرف" })
    .regex(/[A-Z]/, {
      message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
    })
    .regex(/[a-z]/, {
      message: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
    })
    .regex(/[0-9]/, {
      message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
    }),
});

/** 3. PATCH /auth/confirm-email */
export const confirmEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "البريد الإلكتروني غير صالح" }),
  otp: z
    .string()
    .regex(/^\d{6}$/, {
      message: "رمز التحقق يجب أن يكون 6 أرقام فقط",
    }),
});

/** 4. PATCH /auth/resend-otp */
export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "البريد الإلكتروني غير صالح" }),
});

/** 5. POST /auth/forgot-password-otp */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "البريد الإلكتروني غير صالح" }),
});

/** 6. PATCH /auth/reset-password */
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: "البريد الإلكتروني غير صالح" }),
    otp: z
      .string()
      .regex(/^\d{6}$/, {
        message: "رمز التحقق يجب أن يكون 6 أرقام فقط",
      }),
    password: z
      .string()
      .min(8, { message: "كلمة المرور يجب ألا تقل عن 8 أحرف" })
      .regex(/[A-Z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
      })
      .regex(/[a-z]/, {
        message: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
      })
      .regex(/[0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

/** Form values before Zod defaults (role may be omitted). */
export type SignupFormValues = z.input<typeof signupSchema>;
/** Parsed signup payload for the API (role always 0 | 1). */
export type SignupInput = z.output<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ConfirmEmailInput = z.infer<typeof confirmEmailSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Google ID Token body for /auth/gmail and /auth/login/gmail */
export const googleIdTokenSchema = z.object({
  idToken: z
    .string()
    .trim()
    .min(1, { message: "رمز Google مطلوب" }),
});

export type GoogleIdTokenInput = z.infer<typeof googleIdTokenSchema>;

/** Which Google backend endpoint to call from NextAuth. */
export const googleAuthModeSchema = z.enum(["continue", "login"]);
export type GoogleAuthMode = z.infer<typeof googleAuthModeSchema>;
