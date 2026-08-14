"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import type { DropdownProps } from "react-day-picker";

/**
 * Themed replacement for react-day-picker's native <select> dropdowns
 * (month / year) so the open menu matches the app UI.
 */
export default function MasrofyCalendarDropdown({
  options = [],
  className,
  value,
  onChange,
  onBlur,
  disabled,
  style,
  "aria-label": ariaLabel,
  name,
}: DropdownProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.({} as FocusEvent<HTMLSelectElement>);
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
  }, [open, onBlur]);

  function commit(nextValue: number) {
    const event = {
      target: { value: String(nextValue), name },
      currentTarget: { value: String(nextValue), name },
    } as unknown as ChangeEvent<HTMLSelectElement>;
    onChange?.(event);
    setOpen(false);
  }

  return (
    <span
      ref={rootRef}
      data-disabled={disabled || undefined}
      className={`masrofy-cal-dropdown ${className ?? ""}`}
      style={style}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="masrofy-cal-dropdown__trigger"
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
      >
        <span className="masrofy-cal-dropdown__label">{selected?.label ?? ""}</span>
        <svg
          className={`masrofy-cal-dropdown__chevron ${open ? "is-open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" aria-label={ariaLabel} className="masrofy-cal-dropdown__menu">
          {options.map((option) => {
            const active = String(option.value) === String(value);
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={option.disabled}
                  className={[
                    "masrofy-cal-dropdown__option",
                    active ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (option.disabled) return;
                    commit(option.value);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
}
