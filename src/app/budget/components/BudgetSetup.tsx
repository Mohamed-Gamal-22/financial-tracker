"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import type {
  MonthlyBudget,
  UpdateMonthlyBudgetInput,
} from "@/schemas/monthlyBudget.schema";
import {
  createMonthlyBudget,
  deleteMonthlyBudget,
  updateMonthlyBudget,
} from "@/services/api/monthlyBudget";
import { ApiError } from "@/services/api/types";
import { compareYearMonth, formatMoney } from "@/lib/format";

const inputClass =
  "w-full min-w-0 bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-2.5 text-sm text-text-main placeholder-text-muted outline-none transition-all";

const actionButtonClass =
  "h-[42px] shrink-0 rounded-xl text-sm font-bold px-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

type BudgetSetupProps = {
  month: string;
  budget: MonthlyBudget | null | undefined;
  totalIncome: number;
  isLoading?: boolean;
};

export default function BudgetSetup({
  month,
  budget,
  totalIncome,
  isLoading,
}: BudgetSetupProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const monthRelation = compareYearMonth(month);
  const canEdit = monthRelation === 0;
  const monthLockMessage =
    monthRelation < 0
      ? "الشهر ده انتهى — مش هتقدر تعدّل الميزانية، تقدر تتفرج على البيانات بس"
      : monthRelation > 0
        ? "الشهر ده لسه ما جاش — تحديد الميزانية متاح للشهر الحالي فقط"
        : null;

  const canDelete =
    budget != null &&
    budget.actualExpenses <= 0 &&
    budget.actualSavings <= 0;

  useEffect(() => {
    const amount = budget?.expenseAmount ?? 0;
    setDraft(amount > 0 ? String(amount) : "");
  }, [budget?._id, budget?.expenseAmount, month]);

  async function invalidateBudgetQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["monthly-budget"] }),
      queryClient.invalidateQueries({ queryKey: ["monthly-budget-list"] }),
      queryClient.invalidateQueries({ queryKey: ["transaction-summary"] }),
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    ]);
  }

  function handleError(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
      showAlert(error.toAlertPayload());
      return;
    }
    showAlert({
      message: error instanceof Error ? error.message : fallback,
      success: false,
    });
  }

  const createMutation = useMutation({
    mutationFn: createMonthlyBudget,
    onSuccess: async (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      await invalidateBudgetQueries();
    },
    onError: (error) => handleError(error, "تعذر إنشاء الميزانية"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateMonthlyBudgetInput;
    }) => updateMonthlyBudget(id, body),
    onSuccess: async (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      await invalidateBudgetQueries();
    },
    onError: (error) => handleError(error, "تعذر تحديث الميزانية"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMonthlyBudget,
    onSuccess: async (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      await invalidateBudgetQueries();
    },
    onError: (error) => handleError(error, "تعذر حذف الميزانية"),
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-card-border bg-surface/90 p-8 text-center">
        <p className="text-sm font-bold text-text-muted">جاري تحميل الميزانية...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-text-main">
          ميزانية المصروف الشهري
        </h2>
        <p className="mt-1 text-xs font-medium text-text-muted leading-relaxed">
          {canEdit
            ? "حدّد سقف مصروفات الشهر — لازم يكون فيه دخل مسجّل أولًا. الادخار المخطط = الدخل − سقف المصروف."
            : "عرض فقط — التعديل متاح للشهر الحالي"}
        </p>
      </div>

      {monthLockMessage && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-start">
          <p className="text-sm font-extrabold text-orange-700">
            {monthRelation < 0 ? "الشهر ده انتهى" : "شهر مستقبلي"}
          </p>
          <p className="mt-1 text-xs font-medium text-orange-700/90 leading-relaxed">
            {monthLockMessage}
          </p>
        </div>
      )}

      {totalIncome > 0 && (
        <div className="rounded-xl border border-accent-success/25 bg-accent-success/5 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm font-bold text-text-main">إجمالي دخل الشهر</p>
          <p className="text-xl sm:text-2xl font-extrabold text-accent-success tabular-nums">
            {formatMoney(totalIncome)}
          </p>
        </div>
      )}

      {totalIncome <= 0 && canEdit && (
        <div className="rounded-xl border border-sky/30 bg-sky/10 px-4 py-3">
          <p className="text-sm font-bold text-sky">
            سجّل دخل الشهر أولًا قبل إنشاء الميزانية
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="expense-cap" className="text-xs font-bold text-text-main block">
          سقف المصروف
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            id="expense-cap"
            type="number"
            step="any"
            min="0"
            placeholder="مثال: 10000"
            className={`${inputClass} sm:flex-1 disabled:opacity-60`}
            value={draft}
            disabled={!canEdit || isMutating}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              disabled={!canEdit || isMutating || totalIncome <= 0}
              onClick={() => {
                if (!canEdit) {
                  showAlert({
                    message: monthLockMessage ?? "التعديل غير متاح",
                    success: false,
                  });
                  return;
                }
                const raw = draft.trim();
                const nextAmount = Number(raw);
                if (!raw || !Number.isFinite(nextAmount) || nextAmount < 0) {
                  showAlert({
                    message: "أدخل سقف مصروف صالحًا (≥ 0)",
                    success: false,
                  });
                  return;
                }

                if (budget?._id) {
                  updateMutation.mutate({
                    id: budget._id,
                    body: { expenseAmount: nextAmount },
                  });
                  return;
                }

                createMutation.mutate({ month, expenseAmount: nextAmount });
              }}
              className={`${actionButtonClass} bg-primary hover:bg-primary-hover text-text-inverse`}
            >
              {isMutating
                ? "جاري الحفظ..."
                : budget?._id
                  ? "تحديث"
                  : "حفظ الميزانية"}
            </button>

            {budget?._id && (
              <button
                type="button"
                disabled={!canEdit || isMutating || !canDelete}
                title={
                  !canDelete
                    ? "لا يمكن الحذف — الشهر فيه مصروفات أو ادخار مسجّل"
                    : "حذف الميزانية"
                }
                onClick={() => {
                  if (!canDelete) {
                    showAlert({
                      message:
                        "لا يمكن حذف الميزانية — الشهر فيه مصروفات أو ادخار مسجّل فعلاً",
                      success: false,
                    });
                    return;
                  }
                  if (!budget._id) return;
                  deleteMutation.mutate(budget._id);
                }}
                className={`${actionButtonClass} border border-accent-danger/30 bg-accent-danger/5 text-accent-danger`}
              >
                حذف
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
