export type ApiValidationIssue = {
  path: string;
  message: string;
};

export type ApiValidationErrorGroup = {
  key: string;
  issues: ApiValidationIssue[];
};

export type ApiResponse<T = unknown> = {
  message: string;
  success: boolean;
  status: number;
  data?: T;
  errors?: ApiValidationErrorGroup[] | Record<string, unknown>;
  stack?: string;
};

export class ApiError extends Error {
  success: boolean;
  status: number;
  errors?: ApiResponse["errors"];

  constructor(payload: ApiResponse) {
    super(payload.message || "حدث خطأ ما");
    this.name = "ApiError";
    this.success = payload.success;
    this.status = payload.status;
    this.errors = payload.errors;
  }

  toAlertPayload(): Pick<ApiResponse, "message" | "success" | "status"> {
    return {
      message: this.message,
      success: this.success,
      status: this.status,
    };
  }
}
