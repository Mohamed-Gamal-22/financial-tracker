"use client";

import { useEffect, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransaction } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";
import {
  amountToneClass,
  formatDateAr,
  formatMoney,
  resolveCategory,
  categoryTypeOf,
} from "@/lib/format";

type TransactionDetailModalProps = {
  open: boolean;
  transactionId: string | null;
  onClose: () => void;
};

export default function TransactionDetailModal({
  open,
  transactionId,
  onClose,
}: TransactionDetailModalProps) {
  const titleId = useId();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      if (!transactionId) throw new Error("معرّف المعاملة مفقود");
      const response = await getTransaction(transactionId);
      if (!response.data) throw new Error("تعذر قراءة بيانات المعاملة");
      return response.data;
    },
    enabled: open && Boolean(transactionId),
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !transactionId) return null;

  const category = data ? resolveCategory(data.category) : null;
  const type = data ? categoryTypeOf(data.category) : undefined;
  const typeLabel =
    category?.typeLabel ||
    (type ? CATEGORY_TYPE_LABELS[type] : undefined);

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل تفاصيل المعاملة";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl border border-card-border bg-surface shadow-2xl p-6 text-start"
      >
        <h2 id={titleId} className="text-xl font-extrabold text-text-main tracking-tight">
          تفاصيل المعاملة
        </h2>

        {isLoading ? (
          <p className="mt-6 text-sm font-bold text-text-muted">جاري التحميل...</p>
        ) : isError ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 disabled:opacity-60 cursor-pointer"
            >
              {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
            </button>
          </div>
        ) : data ? (
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-bold text-text-muted">العنوان</dt>
              <dd className="font-extrabold text-text-main text-end">{data.title}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-bold text-text-muted">المبلغ</dt>
              <dd className={`font-extrabold text-end ${amountToneClass(type)}`}>
                {formatMoney(data.amount, { type, withSign: true })}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-bold text-text-muted">التصنيف</dt>
              <dd className="font-bold text-text-main text-end">{category?.name ?? "—"}</dd>
            </div>
            {typeLabel && (
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-text-muted">النوع</dt>
                <dd className="font-bold text-text-main text-end">{typeLabel}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="font-bold text-text-muted">التاريخ</dt>
              <dd className="font-bold text-text-main text-end">{formatDateAr(data.date)}</dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-card-border bg-surface px-5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
