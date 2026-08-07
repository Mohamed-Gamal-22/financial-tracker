import { ApiError, type ApiResponse } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://finance-tracker-five-liart.vercel.app";

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
      message: "Invalid server response",
      success: false,
      status: response.status || 500,
    });
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError({
      message: payload.message || "Request failed",
      success: false,
      status: payload.status ?? response.status,
      errors: payload.errors,
    });
  }

  return payload;
}

export { BASE_URL };
