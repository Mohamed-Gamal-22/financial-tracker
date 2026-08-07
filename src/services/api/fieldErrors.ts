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
