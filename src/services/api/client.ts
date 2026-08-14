import { ApiError, type ApiResponse } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://finance-tracker-five-liart.vercel.app";

/**
 * App language for the API.
 * - Always sent as `Accept-Language`
 * - Notification endpoints also use `?lang=` (see docs)
 * Prefer Accept-Language for other routes: strict backends
 * (e.g. GET /transaction) reject unknown query params.
 */
export const API_LANG = "ar";

export type ApiRequestOptions = RequestInit & {
  /** Attach `Authorization: Bearer <accessToken>` when provided. */
  accessToken?: string | null;
};

/** Append/override `lang` query for endpoints that support it (notifications). */
export function withLangQuery(path: string, lang: string = API_LANG) {
  const [pathname, existing = ""] = path.split("?", 2);
  const params = new URLSearchParams(existing);
  params.set("lang", lang);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { accessToken, headers: initHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Prefer Arabic; keep a quality list some i18n middlewares expect.
    "Accept-Language": `${API_LANG}, ar-EG;q=0.9, en;q=0.1`,
  };

  if (initHeaders instanceof Headers) {
    initHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(initHeaders)) {
    for (const [key, value] of initHeaders) {
      headers[key] = value;
    }
  } else if (initHeaders) {
    Object.assign(headers, initHeaders);
  }

  // Ensure language is not accidentally overridden to empty/missing.
  if (!headers["Accept-Language"]?.trim()) {
    headers["Accept-Language"] = API_LANG;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError({
      message: "استجابة غير صالحة من الخادم",
      success: false,
      status: response.status || 500,
    });
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError({
      message: payload.message || "فشل الطلب",
      success: false,
      status: payload.status ?? response.status,
      errors: payload.errors,
    });
  }

  return payload;
}

export { BASE_URL };
