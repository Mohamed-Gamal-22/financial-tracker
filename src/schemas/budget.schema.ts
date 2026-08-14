import { z } from "zod";
import type { CategoryType } from "@/schemas/category.schema";

const objectIdSchema = z
  .string()
  .trim()
  .min(1, { message: "اختر تصنيفًا" })
  .regex(/^[a-fA-F0-9]{24}$/, { message: "معرّف التصنيف غير صالح" });

/** POST /budget */
export const createBudgetSchema = z.object({
  category: objectIdSchema,
  amount: z.coerce
    .number({ message: "المبلغ مطلوب" })
    .finite({ message: "المبلغ غير صالح" })
    .gt(0, { message: "المبلغ يجب أن يكون أكبر من صفر" }),
  month: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, { message: "صيغة الشهر يجب أن تكون YYYY-MM" }),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type CreateBudgetFormValues = z.input<typeof createBudgetSchema>;

export type BudgetCategoryRef = {
  _id: string;
  name: string;
  type?: CategoryType;
};

export type Budget = {
  _id: string;
  category: string | BudgetCategoryRef;
  amount: number;
  month: string;
};

/** Form ready for future edit mode when PATCH arrives. */
export type BudgetFormMode = "create" | "edit";
