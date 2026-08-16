"use client";

/** RHF register + React Compiler can desync input DOM from form state. */
"use no memo";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import { useAuth } from "@/hooks/useAuth";
import {
  updateUserName,
  type UserProfile,
} from "@/services/api/user";
import { ApiError } from "@/services/api/types";
import {
  applyApiFieldErrors,
  formatApiErrorMessage,
} from "@/services/api/fieldErrors";
import {
  updateNameSchema,
  type UpdateNameInput,
} from "@/schemas/user.schema";
import { FULLNAME_INVALID_MESSAGE } from "@/schemas/fullname.schema";
import { USER_PROFILE_QUERY_FILTER } from "@/hooks/useUserProfile";

type PersonalInfoSectionProps = {
  fullname: string;
  email: string;
};

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-3 text-sm text-text-main outline-none transition-all";

function sameName(a: string, b: string) {
  return a.trim().replace(/\s+/g, " ").toLowerCase() ===
    b.trim().replace(/\s+/g, " ").toLowerCase();
}

function nameUpdateAlertMessage(message?: string) {
  const raw = message?.trim();
  if (!raw || /^done$/i.test(raw)) return "تم تحديث الاسم بنجاح";
  return raw;
}

function patchProfileNameCache(
  queryClient: ReturnType<typeof useQueryClient>,
  next: Partial<UserProfile> & { fullname: string },
) {
  queryClient.setQueriesData<UserProfile | null>(
    USER_PROFILE_QUERY_FILTER,
    (prev) => {
      if (!prev) {
        return {
          _id: next._id || "unknown",
          fullname: next.fullname,
          email: next.email || "",
          profilePic: next.profilePic ?? null,
        };
      }
      return {
        ...prev,
        ...next,
        fullname: next.fullname,
      };
    },
  );
}

export default function PersonalInfoSection({
  fullname,
  email,
}: PersonalInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { update } = useAuth();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const originalNameRef = useRef(fullname.trim());

  const {
    control,
    handleSubmit,
    reset,
    setError,
    getValues,
    formState: { errors },
  } = useForm<UpdateNameInput>({
    defaultValues: { fullname },
    resolver: zodResolver(updateNameSchema),
  });

  useEffect(() => {
    if (!editing) reset({ fullname });
  }, [fullname, reset, editing]);

  useEffect(() => {
    if (!editing) return;
    const input = nameInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (submittedName: string) => {
      const response = await updateUserName(submittedName);
      return { response, submittedName };
    },
    onSuccess: async ({ response, submittedName }) => {
      const apiName = response.data?.fullname?.trim();
      const nextName =
        apiName && sameName(apiName, submittedName) ? apiName : submittedName;
      const patch: Partial<UserProfile> & { fullname: string } = {
        ...(response.data ?? {}),
        fullname: nextName,
      };

      patchProfileNameCache(queryClient, patch);

      try {
        await update({ fullname: nextName });
      } catch {
        // Name already saved on the API — keep going.
      }

      await queryClient.invalidateQueries(USER_PROFILE_QUERY_FILTER);
      patchProfileNameCache(queryClient, patch);

      showAlert({
        message: nameUpdateAlertMessage(response.message),
        success: response.success !== false,
        status: response.status ?? 200,
      });

      originalNameRef.current = nextName;
      reset({ fullname: nextName });
      setEditing(false);
    },
    onError: (error) => {
      applyApiFieldErrors(error, setError);
      showAlert({
        message: formatApiErrorMessage(error, "تعذر تحديث الاسم"),
        success: false,
        status: error instanceof ApiError ? error.status : 400,
      });
    },
  });

  const saving = mutation.isPending;

  function startEditing() {
    if (saving) return;
    originalNameRef.current = fullname.trim();
    reset({ fullname });
    setEditing(true);
  }

  function cancelEditing() {
    if (saving) return;
    reset({ fullname });
    setEditing(false);
  }

  function readTypedName() {
    return (nameInputRef.current?.value ?? getValues("fullname") ?? "").trim();
  }

  function onSubmit() {
    if (saving) return;

    const typed = readTypedName();
    const parsed = updateNameSchema.safeParse({ fullname: typed });

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message || FULLNAME_INVALID_MESSAGE;
      setError("fullname", { type: "manual", message });
      showAlert({ message, success: false, status: 400 });
      return;
    }

    const next = parsed.data.fullname;
    if (sameName(next, originalNameRef.current) || sameName(next, fullname)) {
      setEditing(false);
      reset({ fullname });
      return;
    }

    mutation.mutate(next);
  }

  function onInvalid(formErrors: typeof errors) {
    const typed = readTypedName();
    const parsed = updateNameSchema.safeParse({ fullname: typed });
    if (parsed.success) {
      onSubmit();
      return;
    }

    const message =
      parsed.error.issues[0]?.message ||
      formErrors.fullname?.message ||
      FULLNAME_INVALID_MESSAGE;
    showAlert({
      message,
      success: false,
      status: 400,
    });
  }

  return (
    <section className="text-start">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <h3 className="text-base font-extrabold text-text-main">المعلومات الشخصية</h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-text-main text-xs font-bold block">
              الاسم الكامل
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {editing ? (
                <Controller
                  name="fullname"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      disabled={saving}
                      placeholder="محمد أحمد أو First Last"
                      aria-busy={saving}
                      className={`${inputClass} disabled:opacity-70 disabled:cursor-not-allowed`}
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      ref={(element) => {
                        field.ref(element);
                        nameInputRef.current = element;
                      }}
                    />
                  )}
                />
              ) : (
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  readOnly
                  value={fullname}
                  placeholder="محمد أحمد أو First Last"
                  className={`${inputClass} pe-11 cursor-default`}
                />
              )}
              {!editing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label="تعديل الاسم"
                  className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <PencilIcon />
                </button>
              ) : null}
            </div>
            {editing ? (
              <p className="text-[11px] font-medium text-text-muted">
                كلمتان على الأقل، عربي فقط أو إنجليزي فقط
              </p>
            ) : null}
            {errors.fullname ? (
              <p className="text-accent-danger text-xs font-medium">
                {errors.fullname.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-text-main text-xs font-bold block">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email || ""}
                readOnly
                className={`${inputClass} cursor-default`}
              />
            </div>
          </div>
        </div>

        {editing ? (
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={cancelEditing}
              className="inline-flex items-center justify-center rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "جاري الحفظ..." : "حفظ الاسم"}
            </button>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 3.487a1.875 1.875 0 112.651 2.651L7.5 18.15 3 19.5l1.35-4.5 12.512-11.513z"
      />
    </svg>
  );
}
