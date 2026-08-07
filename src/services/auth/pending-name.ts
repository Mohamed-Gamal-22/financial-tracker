const PENDING_NAME_KEY = "pending_fullname";

/** Remember fullname from signup until the user logs in (client-only). */
export function rememberPendingFullname(email: string, fullname: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    PENDING_NAME_KEY,
    JSON.stringify({ email: email.toLowerCase(), fullname }),
  );
}

export function consumePendingFullname(email: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_NAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string; fullname?: string };
    sessionStorage.removeItem(PENDING_NAME_KEY);
    if (
      parsed.email?.toLowerCase() === email.toLowerCase() &&
      parsed.fullname?.trim()
    ) {
      return parsed.fullname.trim();
    }
    return null;
  } catch {
    return null;
  }
}
