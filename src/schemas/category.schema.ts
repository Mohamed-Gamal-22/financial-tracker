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
