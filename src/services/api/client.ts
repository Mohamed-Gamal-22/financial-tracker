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

function isFormDataBody(body: BodyInit | null | undefined): body is FormData {
  if (body == null || typeof body !== "object") return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return true;
  return Object.prototype.toString.call(body) === "[object FormData]";
}

/** Clone FormData so a 401 retry can resend the same upload. */
export function cloneFormData(source: FormData): FormData {
  const next = new FormData();
  source.forEach((value, key) => {
    // Preserve File filename — dropping it can break multer parsers.
    if (typeof File !== "undefined" && value instanceof File) {
      next.append(key, value, value.name);
    } else {
      next.append(key, value);
    }
  });
  return next;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { accessToken, headers: initHeaders, body, ...rest } = options;
  const formData = isFormDataBody(body);

  // Plain object for multipart — some browsers mishandle FormData when
  // Content-Type is present on a Headers instance.
  const headers: Record<string, string> = {
    "Accept-Language": API_LANG,
  };

  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  if (initHeaders) {
    const extra = new Headers(initHeaders);
    extra.forEach((value, key) => {
      if (formData && key.toLowerCase() === "content-type") return;
      headers[key] = value;
    });
  }

  if (formData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  if (!headers["Accept-Language"]?.trim()) {
    headers["Accept-Language"] = API_LANG;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    body,
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

  return {
    ...payload,
    message: payload.message || "Done",
    status: payload.status ?? response.status,
    success: true,
  };
}

export { BASE_URL };
