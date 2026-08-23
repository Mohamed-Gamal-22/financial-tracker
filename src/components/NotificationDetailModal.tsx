"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getNotificationById } from "@/services/api/notification";
import { notificationText } from "@/schemas/notification.schema";
import { localizeNotificationText } from "@/lib/notification-i18n";
import { ApiError } from "@/services/api/types";
import { formatDateAr } from "@/lib/format";

type NotificationDetailModalProps = {
  open: boolean;
  notificationId: string | null;
  onClose: () => void;
};

export default function NotificationDetailModal({
  open,
  notificationId,
  onClose,
}: NotificationDetailModalProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["notification", notificationId, "ar"],
    queryFn: async () => {
      if (!notificationId) throw new Error("معرّف الإشعار مفقود");
      const response = await getNotificationById(notificationId);
      if (!response.data) throw new Error("تعذر قراءة بيانات الإشعار");
      return response.data;
    },
    enabled: open && Boolean(notificationId),
  });

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

  if (!open || !notificationId || typeof document === "undefined") return null;

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل تفاصيل الإشعار";

  return createPortal(
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
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
        className="relative z-10 w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-card-border bg-surface shadow-2xl p-6 text-start"
      >
        <h2 id={titleId} className="text-xl font-extrabold text-text-main tracking-tight">
          تفاصيل الإشعار
        </h2>

        {isLoading ? (
          <p className="mt-6 text-sm font-bold text-text-muted">جاري التحميل...</p>
        ) : isError ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
            </button>
          </div>
        ) : data ? (
          <div className="mt-5 space-y-4">
            {data.title?.trim() && (
              <div>
                <p className="text-xs font-bold text-text-muted mb-1">العنوان</p>
                <p className="text-sm font-extrabold text-text-main">
                  {localizeNotificationText(data.title)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-text-muted mb-1">المحتوى</p>
              <p className="text-sm font-bold text-text-main leading-relaxed whitespace-pre-wrap">
                {notificationText(data)}
              </p>
            </div>
            {data.createdAt && (
              <div>
                <p className="text-xs font-bold text-text-muted mb-1">التاريخ</p>
                <p className="text-sm font-medium text-text-main">
                  {formatDateAr(data.createdAt)}
                </p>
              </div>
            )}
          </div>
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
    </div>,
    document.body,
  );
}
