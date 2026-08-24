const STORAGE_PREFIX = "masrofy:onboarding-flow:";

function storageKey(userKey?: string | null) {
  return `${STORAGE_PREFIX}${userKey?.trim() || "guest"}`;
}

/**
 * True when the user already dismissed onboarding for this calendar month (YYYY-MM).
 */
export function isOnboardingFlowDismissed(
  userKey?: string | null,
  month?: string | null,
): boolean {
  if (typeof window === "undefined" || !month) return true;
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
  if (typeof window === "undefined" || !month) return;
  try {
    window.localStorage.setItem(storageKey(userKey), month);
  } catch {
    // ignore quota / private mode
  }
}
