"use client";

import { useEffect, useState } from "react";

export type AlertItem = {
  id: string;
  message: string;
  success: boolean;
  status?: number;
};

type AlertToastProps = {
  alert: AlertItem;
  onDismiss: (id: string) => void;
  durationMs?: number;
};

export function AlertToast({
  alert,
  onDismiss,
  durationMs = 4500,
}: AlertToastProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const enterId = requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setLeaving(true), durationMs);
    return () => {
      cancelAnimationFrame(enterId);
      window.clearTimeout(timer);
    };
  }, [durationMs]);

  useEffect(() => {
    if (!leaving) return;
    setVisible(false);
    const timer = window.setTimeout(() => onDismiss(alert.id), 280);
    return () => window.clearTimeout(timer);
  }, [leaving, alert.id, onDismiss]);

  const isSuccess = alert.success;

  return (
    <div
      role="alert"
      className={[
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 ease-out",
        visible && !leaving
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-3 opacity-0 scale-95",
        isSuccess
          ? "border-accent-success/25 bg-white/95 text-text-main"
          : "border-accent-danger/25 bg-white/95 text-text-main",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={[
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            isSuccess
              ? "bg-accent-success/15 text-accent-success"
              : "bg-accent-danger/15 text-accent-danger",
          ].join(" ")}
          aria-hidden
        >
          {isSuccess ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>

        <div className="min-w-0 flex-1 text-start">
          <p className="text-sm font-bold leading-snug">{alert.message}</p>
        </div>

        <button
          type="button"
          onClick={() => setLeaving(true)}
          className="rounded-lg p-1 text-text-muted transition-colors hover:bg-black/5 hover:text-text-main"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        className={[
          "alert-progress h-1 origin-right",
          isSuccess ? "bg-accent-success" : "bg-accent-danger",
        ].join(" ")}
      />
    </div>
  );
}
