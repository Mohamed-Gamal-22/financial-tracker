"use client";

/** RHF register + React Compiler can desync input DOM from form state in production. */
"use no memo";

import { useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import { getCategories } from "@/services/api/category";
import { createBudget } from "@/services/api/budget";
import { ApiError } from "@/services/api/types";
import { applyApiFieldErrors } from "@/services/api/fieldErrors";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";
import {
  createBudgetSchema,
  type BudgetFormMode,
  type CreateBudgetFormValues,
  type CreateBudgetInput,
} from "@/schemas/budget.schema";

const inputClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

type BudgetFormModalProps = {
  open: boolean;
  onClose: () => void;
  month: string;
  /** Reserved for future PATCH — only create is active now. */
  mode?: BudgetFormMode;
};

export default function BudgetFormModal({
  open,
  onClose,
  month,
  mode = "create",
}: BudgetFormModalProps) {
  const titleId = useId();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await getCategories()).data ?? [],
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateBudgetFormValues, unknown, CreateBudgetInput>({
    defaultValues: {
      category: "",
      amount: "" as unknown as number,
      month,
    },
    resolver: zodResolver(createBudgetSchema),
  });

  // Reset only when the modal opens (or default month changes) — not on every parent re-render.
  useEffect(() => {
    if (!open) return;
    reset({
      category: "",
      amount: "" as unknown as number,
      month,
    });
  }, [open, reset, month]);

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
    mutationFn: createBudget,
    onSuccess: async (response) => {
      showAlert({
        message: response.message || "تم حفظ الميزانية بنجاح",
        success: true,
        status: response.status,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["budgets"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
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
        message: error instanceof Error ? error.message : "تعذر حفظ الميزانية",
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
          {isEdit ? "تعديل الميزانية" : "إضافة ميزانية"}
        </h2>
        <p className="mt-1 text-sm font-medium text-text-muted">
          حدد سقفًا شهريًا لتصنيف مصروف
        </p>

        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            if (isEdit) {
              showAlert({
                message: "تعديل الميزانية غير متاح بعد — قريبًا",
                success: false,
              });
              return;
            }
            mutation.mutate(values);
          })}
        >
          <div className="space-y-1.5">
            <label htmlFor="budget-category" className="text-xs font-bold text-text-main block">
              التصنيف
            </label>
            <select
              id="budget-category"
              className={inputClass}
              disabled={isEdit}
              {...register("category")}
            >
              <option value="">اختر تصنيف مصروف</option>
              {expenseCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name} ({CATEGORY_TYPE_LABELS[category.type]})
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-accent-danger text-xs font-medium">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="budget-amount" className="text-xs font-bold text-text-main block">
              سقف الميزانية
            </label>
            <input
              id="budget-amount"
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
            <label htmlFor="budget-month" className="text-xs font-bold text-text-main block">
              الشهر
            </label>
            <input
              id="budget-month"
              type="month"
              className={inputClass}
              {...register("month")}
            />
            {errors.month && (
              <p className="text-accent-danger text-xs font-medium">{errors.month.message}</p>
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
              disabled={mutation.isPending || isEdit}
              className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-5 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {mutation.isPending ? "جاري الحفظ..." : isEdit ? "حفظ التعديل" : "حفظ الميزانية"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
