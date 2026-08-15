import { format, isValid, parse } from "date-fns";

export function isIsoDate(value?: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function isYearMonth(value?: string): boolean {
  return Boolean(value && /^\d{4}-\d{2}$/.test(value));
}

export function parseIsoDate(value?: string): Date | undefined {
  if (!isIsoDate(value)) return undefined;
  const date = parse(value!, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseYearMonth(value?: string): Date | undefined {
  if (!isYearMonth(value)) return undefined;
  const date = parse(`${value}-01`, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
}

export function toYearMonth(date: Date): string {
  return format(date, "yyyy-MM");
}

/** Accept YYYY-MM or YYYY-MM-DD and return YYYY-MM for API month filters. */
export function yearMonthFromPeriod(value?: string): string {
  if (!value) return "";
  if (isYearMonth(value)) return value;
  if (isIsoDate(value)) return value.slice(0, 7);
  return "";
}

/** Normalize transaction date strings to YYYY-MM-DD when possible. */
export function normalizeTxDate(value?: string): string {
  if (!value) return "";
  if (isIsoDate(value)) return value;
  const day = value.slice(0, 10);
  return isIsoDate(day) ? day : value;
}
