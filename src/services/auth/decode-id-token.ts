/** Decode JWT payload without verification (backend already verified the token). */
export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");

    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function emailFromGoogleIdToken(idToken: string) {
  const payload = decodeJwtPayload(idToken);
  return typeof payload?.email === "string" ? payload.email : "";
}

export function nameFromGoogleIdToken(idToken: string) {
  const payload = decodeJwtPayload(idToken);
  if (typeof payload?.name === "string" && payload.name.trim()) {
    return payload.name.trim();
  }
  const given =
    typeof payload?.given_name === "string" ? payload.given_name.trim() : "";
  const family =
    typeof payload?.family_name === "string" ? payload.family_name.trim() : "";
  return [given, family].filter(Boolean).join(" ");
}
