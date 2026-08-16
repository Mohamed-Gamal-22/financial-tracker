import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError, type ApiValidationErrorGroup } from "./types";

function isValidationGroups(
  errors: ApiError["errors"],
): errors is ApiValidationErrorGroup[] {
  return Array.isArray(errors);
}

/** Maps API validation `errors[].issues` onto RHF field errors. Returns true if any were applied. */
export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof ApiError) || !isValidationGroups(error.errors)) {
    return false;
  }

  let applied = false;

  for (const group of error.errors) {
    for (const issue of group.issues ?? []) {
      const field = issue.path?.split(".").pop();
      if (!field) continue;

      setError(field as Path<T>, {
        type: "server",
        message: issue.message,
      });
      applied = true;
    }
  }

  return applied;
}

/** Flatten API validation issues into a single user-facing message. */
export function formatApiErrorMessage(
  error: unknown,
  fallback = "حدث خطأ ما",
): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback;
  }

  const details: string[] = [];

  if (isValidationGroups(error.errors)) {
    for (const group of error.errors) {
      for (const issue of group.issues ?? []) {
        const path = issue.path?.trim();
        const msg = issue.message?.trim();
        if (!msg) continue;
        details.push(path ? `${path}: ${msg}` : msg);
      }
    }
  } else if (error.errors && typeof error.errors === "object") {
    for (const value of Object.values(error.errors)) {
      if (typeof value === "string" && value.trim()) {
        details.push(value.trim());
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.trim()) details.push(item.trim());
        }
      }
    }
  }

  if (details.length > 0) {
    const unique = [...new Set(details)];
    return `${error.message}: ${unique.join(" — ")}`;
  }

  return error.message || fallback;
}
