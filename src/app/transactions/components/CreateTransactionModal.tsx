"use client";

/** RHF register + React Compiler can desync input DOM from form state in production. */
"use no memo";

import { useEffect, useId, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import DayPickerField from "@/components/date/DayPickerField";
import { getCategories } from "@/services/api/category";
import { createTransaction } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import { CATEGORY_TYPE_LABELS, type CategoryType } from "@/schemas/category.schema";
import {
  createTransactionSchema,
  type CreateTransactionFormValues,
  type CreateTransactionInput,
} from "@/schemas/transaction.schema";

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

type CategoryTypeFilter = "all" | CategoryType;

type CreateTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  /** Active toolbar filter — limits category options in the select. */
  categoryTypeFilter?: CategoryTypeFilter;
  /** Called after a successful create (e.g. reset list filters). */
  onCreated?: () => void;
};

export default function CreateTransactionModal({
  open,
  onClose,
  categoryTypeFilter = "all",
  onCreated,
}: CreateTransactionModalProps) {
  const titleId = useId();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await getCategories()).data ?? [],
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const visibleCategories =
    categoryTypeFilter === "all"
      ? categories
      : categories.filter((category) => category.type === categoryTypeFilter);

  const categoryHint =
    categoryTypeFilter === "all"
      ? "أدخل تفاصيل المعاملة الجديدة"
      : `تصنيفات ${CATEGORY_TYPE_LABELS[categoryTypeFilter]} فقط`;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<CreateTransactionFormValues, unknown, CreateTransactionInput>({
    defaultValues: {
      title: "",
      amount: "" as unknown as number,
      category: "",
      date: "",
    },
    resolver: zodResolver(createTransactionSchema),
  });

  // Reset only when the modal opens — do NOT depend on `onClose` (new fn every parent render).
  useEffect(() => {
    if (!open) return;
    reset({
      title: "",
      amount: "" as unknown as number,
      category: "",
      date: "",
    });
  }, [open, reset]);

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
        message: response.message || "تم إضافة المعاملة بنجاح",
        success: true,
        status: response.status,
      });
      onCreated?.();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-report"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer"
        onClick={() => {
          if (!mutation.isPending) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl border border-card-border bg-surface shadow-2xl p-6 text-start"
      >
        <h2 id={titleId} className="text-xl font-extrabold text-text-main tracking-tight">
          إضافة معاملة
        </h2>
        <p className="mt-1 text-sm font-medium text-text-muted">
          {categoryHint}
        </p>

        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
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
            <select id="tx-category" className={inputClass} {...register("category")}>
              <option value="">اختر تصنيفًا</option>
              {visibleCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {categoryTypeFilter === "all"
                    ? `${category.name} (${CATEGORY_TYPE_LABELS[category.type]})`
                    : category.name}
                </option>
              ))}
            </select>
            {visibleCategories.length === 0 && (
              <p className="text-xs font-medium text-text-muted">
                لا توجد تصنيفات متاحة لهذا النوع
              </p>
            )}
            {errors.category && (
              <p className="text-accent-danger text-xs font-medium">{errors.category.message}</p>
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

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={onClose}
              className="rounded-xl border border-card-border bg-surface px-5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {mutation.isPending ? "جاري الحفظ..." : "حفظ المعاملة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
