"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { arEG } from "react-day-picker/locale";
import { format, setMonth, setYear } from "date-fns";
import {
  isIsoDate,
  parseIsoDate,
  parseYearMonth,
  toIsoDate,
  toYearMonth,
  yearMonthFromPeriod,
} from "@/lib/date-value";
import { masrofyDayPickerProps } from "@/components/date/masrofy-daypicker";
import "react-day-picker/style.css";
import "./date-picker.css";

const triggerClass =
  "w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm text-text-main outline-none transition-all text-start cursor-pointer flex items-center justify-between gap-2";

const compactTriggerClass =
  "inline-flex items-center gap-2 rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors cursor-pointer select-none";

type PickerMode = "month" | "days";

type MonthPickerFieldProps = {
  id?: string;
  /** YYYY-MM (month only) or YYYY-MM-DD (day filter). */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  disabled?: boolean;
  compact?: boolean;
  compactLabel?: string;
  /** Hide "بالأيام" and only allow picking a month (YYYY-MM). */
  monthOnly?: boolean;
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
  monthOnly = false,
}: MonthPickerFieldProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PickerMode>("month");

  const selectedDay = monthOnly ? undefined : parseIsoDate(value);
  const selectedMonth =
    parseYearMonth(value) ??
    (selectedDay ? parseYearMonth(toYearMonth(selectedDay)) : undefined);

  const [viewYear, setViewYear] = useState(
    () => selectedMonth?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState<Date>(
    () => selectedDay ?? selectedMonth ?? new Date(),
  );

  useEffect(() => {
    if (!open) return;
    setViewYear(selectedMonth?.getFullYear() ?? new Date().getFullYear());
    setViewMonth(selectedDay ?? selectedMonth ?? new Date());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- only sync when opening

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

  const months = useMemo(() => {
    const base = setYear(new Date(), viewYear);
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const date = setMonth(base, monthIndex);
      return {
        date,
        label: format(date, "LLLL", { locale: arEG }),
        value: toYearMonth(date),
      };
    });
  }, [viewYear]);

  const displayLabel = selectedDay
    ? format(selectedDay, "d MMMM yyyy", { locale: arEG })
    : selectedMonth
      ? format(selectedMonth, "MMMM yyyy", { locale: arEG })
      : placeholder;

  const selectedYearMonth = yearMonthFromPeriod(value);

  function commit(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() =>
          setOpen((prev) => {
            if (!prev) {
              setMode(
                monthOnly ? "month" : isIsoDate(value) ? "days" : "month",
              );
            }
            return !prev;
          })
        }
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
            selectedDay || selectedMonth
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
          aria-label={monthOnly ? "اختيار الشهر" : "اختيار الشهر أو اليوم"}
          className="absolute z-50 mt-2 end-0 min-w-[17rem] rounded-2xl border border-card-border bg-surface shadow-xl p-3"
        >
          {!monthOnly && (
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-primary-tint/50 p-1">
              {(
                [
                  { id: "month", label: "شهر فقط" },
                  { id: "days", label: "بالأيام" },
                ] as const
              ).map((tab) => {
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMode(tab.id)}
                    className={[
                      "rounded-lg px-2 py-1.5 text-xs font-extrabold transition-colors cursor-pointer",
                      active
                        ? "bg-surface text-primary shadow-sm"
                        : "text-text-muted hover:text-text-main",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {monthOnly || mode === "month" ? (
            <>
              <div className="flex items-center justify-between gap-2 mb-3">
                <button
                  type="button"
                  aria-label="السنة السابقة"
                  onClick={() => setViewYear((year) => year - 1)}
                  className="size-8 rounded-xl border border-card-border bg-surface hover:bg-primary-tint/50 text-text-main cursor-pointer"
                >
                  ‹
                </button>
                <p className="text-sm font-extrabold text-text-main tabular-nums">
                  {format(setYear(new Date(), viewYear), "yyyy", {
                    locale: arEG,
                  })}
                </p>
                <button
                  type="button"
                  aria-label="السنة التالية"
                  onClick={() => setViewYear((year) => year + 1)}
                  className="size-8 rounded-xl border border-card-border bg-surface hover:bg-primary-tint/50 text-text-main cursor-pointer"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {months.map((monthItem) => {
                  const active = selectedYearMonth === monthItem.value && !selectedDay;
                  const isCurrent =
                    toYearMonth(new Date()) === monthItem.value && !active;
                  return (
                    <button
                      key={monthItem.value}
                      type="button"
                      onClick={() => commit(monthItem.value)}
                      className={[
                        "rounded-xl px-2 py-2.5 text-xs font-bold transition-colors cursor-pointer",
                        active
                          ? "bg-primary text-text-inverse shadow-sm shadow-primary/20"
                          : isCurrent
                            ? "border border-primary/40 text-primary bg-primary-tint/40 hover:bg-primary-tint"
                            : "border border-card-border bg-surface text-text-main hover:bg-primary-tint/50",
                      ].join(" ")}
                    >
                      {monthItem.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-xs font-bold text-text-muted text-start">
                اختار يومًا للفلترة عليه، أو أكّد الشهر المعروض من الزر تحت
              </p>
              <DayPicker
                mode="single"
                month={viewMonth}
                onMonthChange={setViewMonth}
                selected={selectedDay}
                modifiers={{
                  selectedMonth: (date) =>
                    Boolean(selectedYearMonth) &&
                    toYearMonth(date) === selectedYearMonth &&
                    !selectedDay,
                }}
                modifiersClassNames={{
                  selectedMonth: "rdp-selected",
                }}
                onSelect={(date) => {
                  if (!date) return;
                  commit(toIsoDate(date));
                }}
                {...masrofyDayPickerProps}
              />
              <button
                type="button"
                onClick={() => commit(toYearMonth(viewMonth))}
                className="mt-2 w-full rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-3 py-2 text-xs font-bold cursor-pointer"
              >
                اختيار شهر{" "}
                {format(viewMonth, "MMMM yyyy", { locale: arEG })}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => commit(toYearMonth(new Date()))}
            className="mt-2 w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-xs font-bold text-primary hover:bg-primary-tint/40 cursor-pointer"
          >
            الشهر الحالي
          </button>
        </div>
      )}
    </div>
  );
}
