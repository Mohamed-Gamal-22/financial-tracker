const STORAGE_PREFIX = "masrofy:onboarding-flow:";

function storageKey(userKey?: string | null) {
  return `${STORAGE_PREFIX}${userKey?.trim() || "guest"}`;
}

/**
 * Shown on each browser session after login.
 * Later this can switch to a first-of-month gate without changing callers.
 */
export function isOnboardingFlowDismissed(userKey?: string | null): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(storageKey(userKey)) === "dismissed";
  } catch {
    return false;
  }
}

export function markOnboardingFlowDismissed(userKey?: string | null) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(userKey), "dismissed");
  } catch {
    // ignore quota / private mode
  }
}
