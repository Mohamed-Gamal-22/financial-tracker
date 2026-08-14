import { format, isValid, parse } from "date-fns";

export function parseIsoDate(value?: string): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = parse(value, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseYearMonth(value?: string): Date | undefined {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return undefined;
  const date = parse(`${value}-01`, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
}

export function toYearMonth(date: Date): string {
  return format(date, "yyyy-MM");
}
