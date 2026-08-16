/**
 * Prefer the backend message when it is real text.
 * Some endpoints still return English "Done" even with `lang=ar`.
 */
export function apiAlertMessage(
  message: string | undefined | null,
  fallback: string,
): string {
  const trimmed = message?.trim() ?? "";
  if (!trimmed || /^done$/i.test(trimmed)) return fallback;
  return trimmed;
}

/** Last-resort cleanup for any alert that still gets a bare "Done". */
export function normalizeAlertMessage(message: string): string {
  return apiAlertMessage(message, "تم بنجاح");
}
