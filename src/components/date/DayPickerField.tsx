"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { arEG } from "react-day-picker/locale";
import { parseIsoDate, toIsoDate } from "@/lib/date-value";
import { masrofyDayPickerProps } from "@/components/date/masrofy-daypicker";
import "react-day-picker/style.css";
import "./date-picker.css";

const triggerClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main outline-none transition-all text-start cursor-pointer flex items-center justify-between gap-2";

type DayPickerFieldProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  disabled?: boolean;
};

export default function DayPickerField({
  id,
  value = "",
  onChange,
  placeholder = "اختر التاريخ",
  className,
  allowClear = true,
  disabled = false,
}: DayPickerFieldProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);

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

  const label = selected
    ? format(selected, "d MMMM yyyy", { locale: arEG })
    : placeholder;

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${triggerClass} disabled:opacity-60`}
      >
        <span className={selected ? "font-bold" : "font-medium text-text-muted"}>
          {label}
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          {allowClear && selected && (
            <span
              role="button"
              tabIndex={0}
              aria-label="مسح التاريخ"
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
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          role="dialog"
          aria-label="اختيار التاريخ"
          className="absolute z-50 mt-2 start-0 rounded-2xl border border-card-border bg-surface shadow-xl p-3"
        >
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(date) => {
              if (!date) {
                onChange("");
                return;
              }
              onChange(toIsoDate(date));
              setOpen(false);
            }}
            {...masrofyDayPickerProps}
          />
        </div>
      )}
    </div>
  );
}
