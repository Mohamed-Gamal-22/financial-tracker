import { z } from "zod";

export type MonthlyBudget = {
  _id: string;
  month: string;
  expenseAmount: number;
  savingsAmount: number;
  actualExpenses: number;
  actualSavings: number;
  remainingExpenseBudget: number;
  remainingSavings: number;
};

export type MonthlyBudgetListData = {
  budgets: MonthlyBudget[];
  total?: Record<string, number>;
};

/** POST /monthlyBudget */
export const createMonthlyBudgetSchema = z.object({
  month: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, { message: "صيغة الشهر يجب أن تكون YYYY-MM" }),
  expenseAmount: z.coerce
    .number({ message: "سقف المصروف مطلوب" })
    .finite({ message: "المبلغ غير صالح" })
    .gte(0, { message: "سقف المصروف لا يمكن أن يكون سالبًا" }),
});

export type CreateMonthlyBudgetInput = z.infer<typeof createMonthlyBudgetSchema>;
export type CreateMonthlyBudgetFormValues = z.input<typeof createMonthlyBudgetSchema>;

/** PATCH /monthlyBudget/:id */
export const updateMonthlyBudgetSchema = z
  .object({
    month: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}$/, { message: "صيغة الشهر يجب أن تكون YYYY-MM" })
      .optional(),
    expenseAmount: z.coerce
      .number({ message: "سقف المصروف غير صالح" })
      .finite({ message: "المبلغ غير صالح" })
      .gte(0, { message: "سقف المصروف لا يمكن أن يكون سالبًا" })
      .optional(),
  })
  .refine((value) => value.month != null || value.expenseAmount != null, {
    message: "أدخل سقف المصروف أو الشهر للتحديث",
  });

export type UpdateMonthlyBudgetInput = z.infer<typeof updateMonthlyBudgetSchema>;
