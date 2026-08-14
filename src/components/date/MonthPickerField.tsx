"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { arEG } from "react-day-picker/locale";
import { format } from "date-fns";
import { parseYearMonth, toYearMonth } from "@/lib/date-value";
import { masrofyDayPickerProps } from "@/components/date/masrofy-daypicker";
import "react-day-picker/style.css";
import "./date-picker.css";

const triggerClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main outline-none transition-all text-start cursor-pointer flex items-center justify-between gap-2";

const compactTriggerClass =
  "inline-flex items-center gap-2 rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer select-none";

type MonthPickerFieldProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** Compact chip style (budget header / toolbar). */
  compact?: boolean;
  /** Optional leading label inside compact trigger. */
  compactLabel?: string;
};

export default function MonthPickerField({
  id,
  value = "",
  onChange,
  placeholder = "اختر الشهر",
  className,
  allowClear = false,
  disabled = false,
  compact = false,
  compactLabel,
}: MonthPickerFieldProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedMonth = parseYearMonth(value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const displayLabel = selectedMonth
    ? format(selectedMonth, "MMMM yyyy", { locale: arEG })
    : placeholder;

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={
          compact
            ? `${compactTriggerClass} disabled:opacity-60`
            : `${triggerClass} disabled:opacity-60`
        }
      >
        {compact && compactLabel ? (
          <span className="text-text-muted font-medium text-xs">{compactLabel}</span>
        ) : null}
        <span
          className={
            selectedMonth
              ? "font-bold text-text-main"
              : compact
                ? "font-bold text-text-muted"
                : "font-medium text-text-muted"
          }
        >
          {displayLabel}
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          {allowClear && value && (
            <span
              role="button"
              tabIndex={0}
              aria-label="مسح الشهر"
              className="text-xs font-bold text-primary hover:text-primary-hover"
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange("");
                }
              }}
            >
              مسح
            </span>
          )}
          {!compact && (
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="اختيار الشهر"
          className="absolute z-50 mt-2 end-0 rounded-2xl border border-card-border bg-surface shadow-xl p-3"
        >
          <p className="mb-2 text-xs font-bold text-text-muted text-start">
            اختار أي يوم داخل الشهر المطلوب
          </p>
          <DayPicker
            mode="single"
            defaultMonth={selectedMonth ?? new Date()}
            modifiers={{
              selectedMonth: (date) =>
                Boolean(value) && toYearMonth(date) === value,
            }}
            modifiersClassNames={{
              selectedMonth: "rdp-selected",
            }}
            onSelect={(date) => {
              if (!date) return;
              onChange(toYearMonth(date));
              setOpen(false);
            }}
            {...masrofyDayPickerProps}
          />
          <button
            type="button"
            onClick={() => {
              onChange(toYearMonth(new Date()));
              setOpen(false);
            }}
            className="mt-2 w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-xs font-bold text-primary hover:bg-primary-tint/40 cursor-pointer"
          >
            الشهر الحالي
          </button>
        </div>
      )}
    </div>
  );
}
