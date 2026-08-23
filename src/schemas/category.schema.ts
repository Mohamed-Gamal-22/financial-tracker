import { z } from "zod";

export const categoryTypeSchema = z.enum(["income", "expense", "savings"], {
  message: "نوع التصنيف غير صالح",
});

export type CategoryType = z.infer<typeof categoryTypeSchema>;

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: "دخل",
  expense: "مصروف",
  savings: "ادخار",
};

/** Fixed options in create-transaction category select */
export const TRANSACTION_CATEGORY_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: "income", label: "دخل" },
  { value: "expense", label: "مصروفات" },
  { value: "savings", label: "ادخار" },
];
