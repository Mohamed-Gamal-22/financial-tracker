"use client";

/** RHF register + React Compiler can desync input DOM from form state in production. */
"use no memo";

import { useEffect, useId, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import DayPickerField from "@/components/date/DayPickerField";
import { getTransaction, updateTransaction } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import { categoryTypeOf } from "@/lib/format";
import { TRANSACTION_CATEGORY_OPTIONS } from "@/schemas/category.schema";
import type { CategoryType } from "@/schemas/category.schema";
import {
  createTransactionUiSchema,
  type CreateTransactionUiFormValues,
  type CreateTransactionUiInput,
  type Transaction,
  type UpdateTransactionInput,
} from "@/schemas/transaction.schema";

function buildUpdatePayload(
  original: Transaction,
  values: CreateTransactionUiInput,
): UpdateTransactionInput {
  const payload: UpdateTransactionInput = {};
  const origDate = original.date?.slice(0, 10) ?? "";
  const newDate = values.date?.trim() ?? "";
  const originalType = categoryTypeOf(original.category);
  const nextType = values.categoryType as CategoryType;

  if (values.title.trim() !== original.title.trim()) {
    payload.title = values.title.trim();
  }
  if (Number(values.amount) !== Number(original.amount)) {
    payload.amount = values.amount;
  }
  if (nextType !== originalType) {
    payload.category = nextType;
  }
  if (newDate !== origDate) {
    payload.date = newDate;
  }

  return payload;
}

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

type EditTransactionModalProps = {
  open: boolean;
  transactionId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function EditTransactionModal({
  open,
  transactionId,
  onClose,
  onUpdated,
}: EditTransactionModalProps) {
  const titleId = useId();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { data: transaction, isLoading: txLoading } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error("معرّف المعاملة مفقود");
      const response = await getTransaction(transactionId);
      if (!response.data) throw new Error("تعذر قراءة المعاملة");
      return response.data;
    },
    enabled: open && Boolean(transactionId),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
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

  useEffect(() => {
    if (!open || !transaction) return;
    reset({
      title: transaction.title,
      amount: transaction.amount,
      categoryType: categoryTypeOf(transaction.category) ?? "",
      date: transaction.date?.slice(0, 10) ?? "",
    });
  }, [open, transaction, reset]);

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
    mutationFn: (payload: UpdateTransactionInput) => {
      if (!transactionId) throw new Error("معرّف المعاملة مفقود");
      return updateTransaction(transactionId, payload);
    },
    onSuccess: async (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      onUpdated?.();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions-by-day"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions-count"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-report"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["monthly-budget"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] }),
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
        message: error instanceof Error ? error.message : "تعذر تحديث المعاملة",
        success: false,
      });
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (!transaction) return;

    const payload = buildUpdatePayload(transaction, values);
    if (Object.keys(payload).length === 0) {
      showAlert({
        message: "لم يتم تغيير أي حقل",
        success: false,
      });
      return;
    }
    mutation.mutate(payload);
  });

  const isSaving = mutation.isPending;

  if (!open || !transactionId) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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
          تعديل المعاملة
        </h2>
        <p className="mt-1 text-sm font-medium text-text-muted">
          عدّل الحقول المطلوبة — الباك إند يعيد فحص قواعد الميزانية
        </p>

        {txLoading ? (
          <p className="mt-6 text-sm font-bold text-text-muted">جاري التحميل...</p>
        ) : (
          <form className="mt-5 space-y-4" noValidate onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="edit-tx-title" className="text-xs font-bold text-text-main block">
                العنوان
              </label>
              <input
                id="edit-tx-title"
                type="text"
                className={inputClass}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-accent-danger text-xs font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-tx-amount" className="text-xs font-bold text-text-main block">
                المبلغ
              </label>
              <input
                id="edit-tx-amount"
                type="number"
                step="any"
                min="0"
                className={inputClass}
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-accent-danger text-xs font-medium">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-tx-category" className="text-xs font-bold text-text-main block">
                التصنيف
              </label>
              <select id="edit-tx-category" className={inputClass} {...register("categoryType")}>
                <option value="">اختر تصنيف المعامله...</option>
                {TRANSACTION_CATEGORY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
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
              <label htmlFor="edit-tx-date" className="text-xs font-bold text-text-main block">
                التاريخ <span className="text-text-muted font-medium">(اختياري)</span>
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DayPickerField
                    id="edit-tx-date"
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
                disabled={isSaving}
                className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
