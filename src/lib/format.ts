import type { CategoryType } from "@/schemas/category.schema";
import type { Transaction, TransactionCategoryRef } from "@/schemas/transaction.schema";

export function resolveCategory(
  category: Transaction["category"],
): TransactionCategoryRef | null {
  if (!category) return null;
  if (typeof category === "string") {
    return { _id: category, name: "—" };
  }
  return category;
}

export function categoryTypeOf(
  category: Transaction["category"],
): CategoryType | undefined {
  const resolved = resolveCategory(category);
  return resolved?.type;
}

/** Format amount with EGP; sign from category type when available. */
export function formatMoney(
  amount: number,
  options?: { type?: CategoryType; withSign?: boolean },
) {
  const absolute = Math.abs(amount);
  const formatted = absolute.toLocaleString("ar-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (!options?.withSign) {
    return `${formatted} ج.م`;
  }

  const type = options.type;
  if (type === "income" || type === "savings") {
    return `+ ${formatted} ج.م`;
  }
  if (type === "expense") {
    return `- ${formatted} ج.م`;
  }
  return `${formatted} ج.م`;
}

export function amountToneClass(type?: CategoryType) {
  if (type === "income" || type === "savings") return "text-accent-success";
  if (type === "expense") return "text-accent-danger";
  return "text-text-main";
}

export function formatDateAr(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function sumTotals(
  rows: { total: number }[] | undefined,
): number {
  if (!rows?.length) return 0;
  return rows.reduce((acc, row) => acc + (Number(row.total) || 0), 0);
}

/** Current calendar month as YYYY-MM. */
export function currentYearMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** -1 past, 0 current, 1 future (invalid → treat as past). */
export function compareYearMonth(month: string, relativeTo = currentYearMonth()) {
  if (!/^\d{4}-\d{2}$/.test(month) || !/^\d{4}-\d{2}$/.test(relativeTo)) {
    return -1;
  }
  if (month === relativeTo) return 0;
  return month < relativeTo ? -1 : 1;
}
