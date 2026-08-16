"use client";

import { useEffect, useId, useState } from "react";
import { useAlert } from "@/app/(auth)/alerts";
import { useAuth } from "@/hooks/useAuth";
import { freezeAccount } from "@/services/api/user";
import { ApiError } from "@/services/api/types";

export default function FreezeAccountSection() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const descId = useId();
  const { showAlert } = useAlert();
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, pending]);

  async function handleFreeze() {
    if (pending) return;
    setPending(true);

    try {
      const response = await freezeAccount();
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      setOpen(false);
      await logout({ skipApi: true, callbackUrl: "/login" });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "تعذر تجميد الحساب";
      showAlert({
        message,
        success: false,
        status: error instanceof ApiError ? error.status : 400,
      });
      setPending(false);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-4 sm:p-5 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent-danger/15 text-accent-danger">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </span>
              <h3 className="text-base font-extrabold text-accent-danger">منطقة الخطر</h3>
            </div>
            <p className="text-sm font-medium text-text-muted leading-relaxed">
              تجميد الحساب يوقف الوصول إلى بياناتك مؤقتًا دون حذفها نهائيًا. قد يمكن استرجاع الحساب لاحقًا إن توفر ذلك.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-danger hover:bg-accent-danger/90 text-white text-sm font-bold px-5 py-3 shadow-lg shadow-accent-danger/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            تجميد الحساب
          </button>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="إغلاق"
            disabled={pending}
            className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer disabled:cursor-not-allowed"
            onClick={() => {
              if (!pending) setOpen(false);
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="relative w-full max-w-md rounded-2xl border border-accent-danger/20 bg-surface shadow-2xl p-6 text-start"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent-danger/15 text-accent-danger mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h2 id={titleId} className="text-xl font-extrabold text-text-main tracking-tight">
              تأكيد تجميد الحساب
            </h2>
            <p id={descId} className="mt-2 text-sm font-medium text-text-muted leading-relaxed">
              هل أنت متأكد من تجميد حسابك؟ لن تتمكن من استخدام التطبيق حتى يتم استرجاع الحساب. هذا إجراء يحتاج تأكيدًا صريحًا ولا يمكن التراجع عنه من واجهة المستخدم.
            </p>

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-card-border bg-surface px-5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={handleFreeze}
                className="rounded-xl bg-accent-danger hover:bg-accent-danger/90 text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-accent-danger/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {pending ? "جاري التجميد..." : "نعم، جمّد الحساب"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
