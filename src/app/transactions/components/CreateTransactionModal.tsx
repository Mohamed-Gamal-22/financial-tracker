"use client";

/** RHF register + React Compiler can desync input DOM from form state in production. */
"use no memo";

import { useEffect, useId, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import DayPickerField from "@/components/date/DayPickerField";
import {
  createTransaction,
  getTransactionsCount,
} from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  type CategoryType,
} from "@/schemas/category.schema";
import {
  createTransactionUiSchema,
  type CreateTransactionInput,
  type CreateTransactionUiFormValues,
  type CreateTransactionUiInput,
} from "@/schemas/transaction.schema";
import { currentYearMonth } from "@/lib/format";

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

type CategoryTypeFilter = "all" | CategoryType;

type CreateTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  /** Active toolbar filter — pre-selects type when not "all". */
  categoryTypeFilter?: CategoryTypeFilter;
  /** Called after a successful create (e.g. reset list filters). */
  onCreated?: () => void;
  heading?: string;
  description?: string;
  submitLabel?: string;
};

export default function CreateTransactionModal({
  open,
  onClose,
  categoryTypeFilter = "all",
  onCreated,
  heading,
  description,
  submitLabel,
}: CreateTransactionModalProps) {
  const titleId = useId();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateTransactionUiFormValues, unknown, CreateTransactionUiInput>({
    defaultValues: {
      title: "",
      amount: "" as unknown as number,
      categoryType: "",
      date: "",
    },
    resolver: zodResolver(createTransactionUiSchema),
  });

  const watchedDate = useWatch({ control, name: "date" });
  const watchedCategoryType = useWatch({ control, name: "categoryType" });
  const targetMonth = useMemo(() => {
    const raw = typeof watchedDate === "string" ? watchedDate.trim() : "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw.slice(0, 7);
    return currentYearMonth();
  }, [watchedDate]);

  const { data: monthTxCount = 0, isLoading: countLoading } = useQuery({
    queryKey: ["transactions-count", "month-first-check", targetMonth],
    queryFn: () => getTransactionsCount({ month: targetMonth }),
    enabled: open,
    staleTime: 30_000,
  });

  /** First transaction in the selected month must be income. */
  const requireIncomeFirst = !countLoading && monthTxCount === 0;

  const categoryHint = requireIncomeFirst
    ? "أول معاملة في الشهر لازم تكون دخل"
    : categoryTypeFilter === "all"
      ? "أدخل تفاصيل المعاملة الجديدة"
      : `اختر نوع المعاملة — ${TRANSACTION_CATEGORY_OPTIONS.find((o) => o.value === categoryTypeFilter)?.label ?? ""}`;

  useEffect(() => {
    if (!open) return;
    reset({
      title: "",
      amount: "" as unknown as number,
      categoryType:
        categoryTypeFilter !== "all" && categoryTypeFilter !== undefined
          ? categoryTypeFilter
          : "",
      date: "",
    });
  }, [open, reset, categoryTypeFilter]);

  // Clear non-income selection when first-of-month lock engages.
  useEffect(() => {
    if (!open || !requireIncomeFirst || !watchedCategoryType) return;
    if (watchedCategoryType !== "income") {
      setValue("categoryType", "", { shouldValidate: false });
    }
  }, [open, requireIncomeFirst, watchedCategoryType, setValue]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: async (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      onCreated?.();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions-by-day"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions-count"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-report"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["monthly-budget"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
      onClose();
    },
    onError: (error) => {
      applyApiFieldErrors(error, setError);
      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message: error instanceof Error ? error.message : "تعذر إضافة المعاملة",
        success: false,
      });
    },
  });

  const onSubmit = handleSubmit((values) => {
    const payload: CreateTransactionInput = {
      title: values.title,
      amount: values.amount,
      category: values.categoryType,
      date: values.date,
    };
    mutation.mutate(payload);
  });

  const isSaving = mutation.isPending;
  const selectDisabled = countLoading;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer"
        onClick={() => {
          if (!isSaving) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md max-h-[min(90dvh,40rem)] overflow-y-auto overscroll-contain rounded-2xl border border-card-border bg-surface shadow-2xl p-4 sm:p-6 text-start"
      >
        <h2 id={titleId} className="text-lg sm:text-xl font-extrabold text-text-main tracking-tight">
          {heading ?? "إضافة معاملة"}
        </h2>
        <p className="mt-1 text-sm font-medium text-text-muted">
          {description ?? categoryHint}
        </p>

        {requireIncomeFirst && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-3 text-start"
          >
            <p className="text-sm font-extrabold text-orange-700">
              أول معاملة في الشهر لازم تكون دخل
            </p>
            <p className="mt-1 text-xs font-medium text-orange-700/90 leading-relaxed">
              بعد تسجيل دخل لهذا الشهر تقدر تضيف مصروفات وادخار عادي.
            </p>
          </div>
        )}

        <form className="mt-5 space-y-4" noValidate onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="tx-title" className="text-xs font-bold text-text-main block">
              العنوان
            </label>
            <input
              id="tx-title"
              type="text"
              placeholder="مثال: شراء طعام"
              className={inputClass}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-accent-danger text-xs font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-amount" className="text-xs font-bold text-text-main block">
              المبلغ
            </label>
            <input
              id="tx-amount"
              type="number"
              step="any"
              min="0"
              placeholder="0"
              className={inputClass}
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-accent-danger text-xs font-medium">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-category" className="text-xs font-bold text-text-main block">
              التصنيف
            </label>
            <select
              id="tx-category"
              className={inputClass}
              disabled={selectDisabled}
              {...register("categoryType")}
            >
              <option value="">
                {countLoading ? "جاري التحميل..." : "اختر تصنيف المعامله..."}
              </option>
              {TRANSACTION_CATEGORY_OPTIONS.map(({ value, label }) => (
                <option
                  key={value}
                  value={value}
                  disabled={requireIncomeFirst && value !== "income"}
                >
                  {label}
                </option>
              ))}
            </select>
            {errors.categoryType && (
              <p className="text-accent-danger text-xs font-medium">
                {errors.categoryType.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-date" className="text-xs font-bold text-text-main block">
              التاريخ <span className="text-text-muted font-medium">(اختياري)</span>
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DayPickerField
                  id="tx-date"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="اختر التاريخ"
                />
              )}
            />
            {errors.date && (
              <p className="text-accent-danger text-xs font-medium">{errors.date.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 sm:justify-end pt-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-card-border bg-surface px-5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving || selectDisabled}
              className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? "جاري الحفظ..." : (submitLabel ?? "حفظ المعاملة")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
