"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import type { Category } from "@/services/api/category";
import type { Budget } from "@/schemas/budget.schema";
import { createBudget, resolveBudgetCategory } from "@/services/api/budget";
import { ApiError } from "@/services/api/types";
import { compareYearMonth, formatMoney } from "@/lib/format";

const inputClass =
  "w-full min-w-0 bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-2 text-sm text-text-main placeholder-text-muted outline-none transition-all";

type BudgetSetupProps = {
  categories: Category[];
  budgets: Budget[];
  month: string;
  isLoading?: boolean;
  /** Caps saved this session when API returns amount as 0. */
  amountOverrides: Record<string, number>;
  onAmountSaved: (categoryId: string, amount: number) => void;
};

export default function BudgetSetup({
  categories,
  budgets,
  month,
  isLoading,
  amountOverrides,
  onAmountSaved,
}: BudgetSetupProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const monthRelation = compareYearMonth(month);
  const canEditCaps = monthRelation === 0;
  const monthLockMessage =
    monthRelation < 0
      ? "الشهر ده عدى خلاص — مش هتقدر تحدد سقف الميزانية عليه، تقدر تتفرج على اللي اتحمل بس"
      : monthRelation > 0
        ? "الشهر ده لسه ما جاش — تحديد سقف الميزانية متاح للشهر الحالي فقط"
        : null;

  const budgetByCategoryId = useMemo(() => {
    const map = new Map<string, Budget>();
    for (const budget of budgets) {
      const category = resolveBudgetCategory(budget.category);
      if (category?._id) map.set(category._id, budget);
    }
    return map;
  }, [budgets]);

  function effectiveAmount(categoryId: string): number {
    const override = amountOverrides[categoryId];
    if (typeof override === "number" && override > 0) return override;
    const existing = budgetByCategoryId.get(categoryId);
    const amount = Number(existing?.amount) || 0;
    return amount > 0 ? amount : 0;
  }

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const category of categories) {
      const amount = effectiveAmount(category._id);
      next[category._id] = amount > 0 ? String(amount) : "";
    }
    setDrafts(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when server/override data changes
  }, [categories, budgetByCategoryId, month, amountOverrides]);

  const mutation = useMutation({
    mutationFn: createBudget,
    onSuccess: async (response, variables) => {
      const savedAmount =
        Number(response.data?.amount) > 0
          ? Number(response.data?.amount)
          : variables.amount;
      onAmountSaved(variables.category, savedAmount);
      showAlert({
        message: response.message || "تم حفظ الميزانية بنجاح",
        success: true,
        status: response.status,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["budgets"] }),
        queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message: error instanceof Error ? error.message : "تعذر حفظ الميزانية",
        success: false,
      });
    },
    onSettled: () => setSavingId(null),
  });

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل التصنيفات...</p>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">لا توجد تصنيفات مصروف متاحة</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-text-main">تحديد ميزانية التصنيفات</h2>
        <p className="mt-1 text-xs font-medium text-text-muted">
          {canEditCaps
            ? "أدخل سقف كل تصنيف مصروف ثم احفظ — التعديل لاحقًا لما يتوفر من الباك"
            : "عرض فقط — تحديد الأسقف متاح للشهر الحالي"}
        </p>
      </div>

      {monthLockMessage && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-start">
          <p className="text-sm font-extrabold text-orange-700">
            {monthRelation < 0 ? "الشهر ده عدى خلاص" : "شهر مستقبلي"}
          </p>
          <p className="mt-1 text-xs font-medium text-orange-700/90 leading-relaxed">
            {monthLockMessage}
          </p>
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => {
          const amount = effectiveAmount(category._id);
          const hasBudget = amount > 0;
          const isSaving = savingId === category._id && mutation.isPending;
          const fieldsLocked = !canEditCaps || hasBudget || isSaving;

          return (
            <li
              key={category._id}
              className="flex flex-col gap-3 rounded-xl border border-card-border/80 bg-surface/80 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-text-main truncate">
                  {category.name}
                </p>
                {hasBudget && (
                  <p className="mt-0.5 text-[11px] font-bold text-primary">
                    محفوظ: {formatMoney(amount)}
                  </p>
                )}
                {!canEditCaps && !hasBudget && (
                  <p className="mt-0.5 text-[11px] font-bold text-text-muted">
                    لم يُحدد سقف لهذا التصنيف
                  </p>
                )}
              </div>

              <div className="mt-auto flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder={canEditCaps ? "سقف الميزانية" : "—"}
                  className={`${inputClass} disabled:opacity-60`}
                  value={drafts[category._id] ?? ""}
                  disabled={fieldsLocked}
                  onChange={(event) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [category._id]: event.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={fieldsLocked}
                  title={
                    !canEditCaps
                      ? monthRelation < 0
                        ? "الشهر ده عدى خلاص"
                        : "الشهر لسه ما جاش"
                      : hasBudget
                        ? "تعديل الميزانية غير متاح بعد"
                        : "حفظ الميزانية"
                  }
                  onClick={() => {
                    if (!canEditCaps) {
                      showAlert({
                        message:
                          monthRelation < 0
                            ? "الشهر ده عدى خلاص — مش هتقدر تحدد ميزانية عليه"
                            : "تحديد الميزانية متاح للشهر الحالي فقط",
                        success: false,
                      });
                      return;
                    }
                    const raw = (drafts[category._id] ?? "").trim();
                    const nextAmount = Number(raw);
                    if (!raw || !Number.isFinite(nextAmount) || nextAmount <= 0) {
                      showAlert({
                        message: "أدخل مبلغًا أكبر من صفر",
                        success: false,
                      });
                      return;
                    }
                    setSavingId(category._id);
                    mutation.mutate({
                      category: category._id,
                      amount: nextAmount,
                      month,
                    });
                  }}
                  className="shrink-0 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-bold px-4 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving
                    ? "..."
                    : !canEditCaps
                      ? monthRelation < 0
                        ? "عدى"
                        : "قفل"
                      : hasBudget
                        ? "محفوظ"
                        : "حفظ"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
