import { sumTotals } from "@/lib/format";
import type { TransactionSummaryData } from "@/schemas/transaction.schema";

const STORAGE_PREFIX = "masrofy:onboarding-flow:";

function storageKey(userKey?: string | null) {
  const normalized = userKey?.toLowerCase().trim();
  return `${STORAGE_PREFIX}${normalized || "guest"}`;
}

/**
 * True when the user already dismissed onboarding for this calendar month (YYYY-MM).
 */
export function isOnboardingFlowDismissed(
  userKey?: string | null,
  month?: string | null,
): boolean {
  if (typeof window === "undefined" || !month || !userKey?.trim()) return true;
  try {
    return window.localStorage.getItem(storageKey(userKey)) === month;
  } catch {
    return false;
  }
}

/** Remember dismissal for the given calendar month (YYYY-MM). */
export function markOnboardingFlowDismissed(
  userKey?: string | null,
  month?: string | null,
) {
  if (typeof window === "undefined" || !month || !userKey?.trim()) return;
  try {
    window.localStorage.setItem(storageKey(userKey), month);
  } catch {
    // ignore quota / private mode
  }
}

/** True when the month summary has any income, expense, or savings amount. */
export function hasMonthFinancialActivity(
  summary?: TransactionSummaryData | null,
): boolean {
  if (!summary) return false;
  return (
    sumTotals(summary.income) +
      sumTotals(summary.expense) +
      sumTotals(summary.savings) >
    0
  );
}
