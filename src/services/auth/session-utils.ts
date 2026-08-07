/** Clear leftovers from the pre-NextAuth localStorage/cookie approach. */
export function clearLegacyAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
  document.cookie = "auth_session=; path=/; max-age=0; SameSite=Lax";
}

/** Only allow same-origin relative paths (blocks open redirects). */
export function safeInternalPath(
  value: string | null | undefined,
  fallback = "/profile",
) {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.startsWith("/\\")) return fallback;
  return value;
}
