import { getSession } from "next-auth/react";
import { apiRequest, type ApiRequestOptions } from "./client";
import type { ApiResponse } from "./types";

/** Client-side authenticated request using the NextAuth session access token. */
export async function authedApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }

  return apiRequest<T>(path, {
    ...options,
    accessToken,
  });
}
