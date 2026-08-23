import { ApiError } from "@/services/api/types";

const AUTH_FAILURE_MESSAGE =
  /jwt expired|token expired|invalid token|unauthorized|غير مصرح|انتهت صلاحية/i;

/** True when the API rejected the request because the access token is invalid/expired. */
export function isAuthFailureError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  if (error.status === 401 || error.status === 403) {
    return true;
  }

  return AUTH_FAILURE_MESSAGE.test(error.message);
}
