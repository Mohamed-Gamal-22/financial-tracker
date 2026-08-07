export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type AuthUser = {
  fullname: string;
  email: string;
};

export function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "User";
  return (
    local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || "User"
  );
}

/** Parse login API `data` into tokens + user (server-safe, no sessionStorage). */
export function parseLoginData(
  data: unknown,
  fallbackEmail: string,
  preferredFullname?: string,
): { tokens: AuthTokens; user: AuthUser } | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const nested =
    root.user && typeof root.user === "object"
      ? (root.user as Record<string, unknown>)
      : null;

  const access_token =
    (typeof root.access_token === "string" && root.access_token) ||
    (typeof root.accessToken === "string" && root.accessToken) ||
    null;
  const refresh_token =
    (typeof root.refresh_token === "string" && root.refresh_token) ||
    (typeof root.refreshToken === "string" && root.refreshToken) ||
    null;

  if (!access_token || !refresh_token) return null;

  const fullnameCandidate =
    (typeof root.fullname === "string" && root.fullname) ||
    (typeof nested?.fullname === "string" && nested.fullname) ||
    (typeof nested?.name === "string" && nested.name) ||
    preferredFullname ||
    "";

  const emailCandidate =
    (typeof root.email === "string" && root.email) ||
    (typeof nested?.email === "string" && nested.email) ||
    fallbackEmail;

  return {
    tokens: { access_token, refresh_token },
    user: {
      email: emailCandidate,
      fullname:
        fullnameCandidate.trim() || displayNameFromEmail(emailCandidate),
    },
  };
}
