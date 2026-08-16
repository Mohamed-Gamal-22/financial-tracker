"use client";

import { useEffect, useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/app/(auth)/alerts";
import { deleteTransaction } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";

type DeleteTransactionDialogProps = {
  open: boolean;
  transactionId: string;
  transactionTitle: string;
  onClose: () => void;
  onDeleted?: () => void;
};

export default function DeleteTransactionDialog({
  open,
  transactionId,
  transactionTitle,
  onClose,
  onDeleted,
}: DeleteTransactionDialogProps) {
  const titleId = useId();
  const descId = useId();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, pending, onClose]);

  const mutation = useMutation({
    mutationFn: () => deleteTransaction(transactionId),
    onSuccess: (response) => {
      showAlert({
        message: response.message,
        success: true,
        status: response.status,
      });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions-by-day"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions-count"] });
      void queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["transaction-report"] });
      void queryClient.invalidateQueries({ queryKey: ["recent-transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setPending(false);
      onDeleted?.();
      onClose();
    },
    onError: (error) => {
      setPending(false);
      if (error instanceof ApiError) {
        showAlert(error.toAlertPayload());
        return;
      }
      showAlert({
        message: error instanceof Error ? error.message : "تعذر حذف المعاملة",
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
        disabled={pending || mutation.isPending}
        className="absolute inset-0 bg-text-main/40 backdrop-blur-[2px] cursor-pointer disabled:cursor-not-allowed"
        onClick={() => {
          if (!pending && !mutation.isPending) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md rounded-2xl border border-accent-danger/20 bg-surface shadow-2xl p-6 text-start"
      >
        <h2 id={titleId} className="text-xl font-extrabold text-text-main tracking-tight">
          تأكيد حذف المعاملة
        </h2>
        <p id={descId} className="mt-2 text-sm font-medium text-text-muted leading-relaxed">
          هل أنت متأكد من حذف «{transactionTitle}»؟ لا يمكن التراجع عن هذا الإجراء من الواجهة.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={onClose}
            className="rounded-xl border border-card-border bg-surface px-5 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => {
              setPending(true);
              mutation.mutate();
            }}
            className="rounded-xl bg-accent-danger hover:bg-accent-danger/90 text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-accent-danger/25 transition-all disabled:opacity-60 cursor-pointer"
          >
            {mutation.isPending ? "جاري الحذف..." : "نعم، احذف"}
          </button>
        </div>
      </div>
    </div>
  );
}
