import { ApiError, type ApiResponse } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://finance-tracker-five-liart.vercel.app";

/**
 * Prefer Accept-Language header over `?lang=` query.
 * Strict backends (e.g. GET /transaction) reject unknown query params with Validation Error.
 */
const API_LANG = "ar";

export type ApiRequestOptions = RequestInit & {
  /** Attach `Authorization: Bearer <accessToken>` when provided. */
  accessToken?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { accessToken, headers: initHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept-Language": API_LANG,
    ...(initHeaders ?? {}),
  };

  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
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
