"use client";

import { useEffect, useId } from "react";

export type OnboardingStep = 1 | 2 | 3;

type OnboardingFlowModalProps = {
  open: boolean;
  step: OnboardingStep;
  onAddIncome: () => void;
  onNextStep: () => void;
  onPrevStep?: () => void;
  onGoToBudget?: () => void;
  onGoToTransactions: () => void;
  onDismiss: () => void;
};

export default function OnboardingFlowModal({
  open,
  step,
  onAddIncome,
  onNextStep,
  onPrevStep,
  onGoToBudget,
  onGoToTransactions,
  onDismiss,
}: OnboardingFlowModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:ps-[280px]">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer"
        onClick={onDismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md max-h-[min(90dvh,40rem)] overflow-y-auto overscroll-contain rounded-2xl border border-card-border bg-surface shadow-2xl p-4 sm:p-6 text-start pointer-events-auto"
      >
        <p className="text-[11px] sm:text-xs font-extrabold text-sky tracking-wide">
          طريقة الاستخدام — خطوة بخطوة
        </p>
        <h2
          id={titleId}
          className="mt-1 text-lg sm:text-xl font-extrabold text-text-main tracking-tight"
        >
          {step === 1 && "ابدأ أولًا بدخل الشهر"}
          {step === 2 && "حدّد ميزانية الشهر (اختياري)"}
          {step === 3 && "بعدين سجّل معاملاتك ومصروفاتك"}
        </h2>
        <p className="mt-2 text-sm font-medium text-text-muted leading-relaxed">
          {step === 1 && (
            "قبل أي مصروف، لازم تسجّل دخل الشهر (راتب أو أي مصدر دخل). ده الأساس اللي هتمشي عليه الميزانية والتقارير."
          )}
          {step === 2 && (
            "إضافة الميزانية خطوة اختيارية، لكنها مهمة جدًا لأنها بتساعدك في تحديد التقارير المستقبلية ومقارنة أدائك بالميزانيات القديمة وتثبيت سقف المصروف والادخار."
          )}
          {step === 3 && (
            <>
              <span className="lg:hidden">
                اضغط الزر للانتقال إلى صفحة المعاملات وسجّل مصاريفك في حدود دخلك والميزانية المحددة.
              </span>
              <span className="hidden lg:inline">
                من قائمة الجانب اختَر «المعاملات» لإضافة مصروفاتك اليومية ومتابعة رصيدك أولًا بأول.
              </span>
            </>
          )}
        </p>

        <ol className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
          <li
            className={[
              "flex items-start gap-3 rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3",
              step === 1
                ? "border-primary/35 bg-primary-tint text-primary"
                : "border-card-border bg-card-bg/40 text-text-muted",
            ].join(" ")}
          >
            <span
              className={[
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-text-inverse",
                step === 1 ? "bg-primary" : "bg-text-muted",
              ].join(" ")}
            >
              1
            </span>
            <span className="min-w-0 text-sm font-bold leading-snug text-text-main">
              أضف دخل الشهر أولًا
            </span>
          </li>
          <li
            className={[
              "flex items-start gap-3 rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3",
              step === 2
                ? "border-sky/50 bg-sky/10 text-sky"
                : "border-card-border bg-card-bg/40 text-text-muted",
            ].join(" ")}
          >
            <span
              className={[
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-text-inverse",
                step === 2 ? "bg-sky" : "bg-text-muted",
              ].join(" ")}
            >
              2
            </span>
            <span className="min-w-0 text-sm font-bold leading-snug text-text-main">
              حدّد ميزانية الشهر (اختياري ومهم للتقارير)
            </span>
          </li>
          <li
            className={[
              "flex items-start gap-3 rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3",
              step === 3
                ? "border-primary/35 bg-primary-tint text-primary"
                : "border-card-border bg-card-bg/40 text-text-muted",
            ].join(" ")}
          >
            <span
              className={[
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-text-inverse",
                step === 3 ? "bg-primary" : "bg-text-muted",
              ].join(" ")}
            >
              3
            </span>
            <span className="min-w-0 text-sm font-bold leading-snug text-text-main">
              سجّل معاملاتك في حدود دخلك
            </span>
          </li>
        </ol>

        {step === 1 && (
          <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onAddIncome}
              className="w-full rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              أضف دخل الشهر
            </button>
            <button
              type="button"
              onClick={onNextStep}
              className="w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary-tint/40 transition-colors cursor-pointer"
            >
              التالي
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onGoToBudget}
              className="w-full rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              الذهاب إلى الميزانية
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onNextStep}
                className="rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary-tint/40 transition-colors cursor-pointer"
              >
                التالي
              </button>
              <button
                type="button"
                onClick={onPrevStep}
                className="rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-muted hover:text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer"
              >
                السابق
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onGoToTransactions}
              className="w-full rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              الذهاب إلى المعاملات
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer"
              >
                فهمت
              </button>
              <button
                type="button"
                onClick={onPrevStep}
                className="rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-muted hover:text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer"
              >
                السابق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
