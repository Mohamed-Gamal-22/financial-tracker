import { z } from "zod";
import { categoryTypeSchema } from "@/schemas/category.schema";

const objectIdSchema = z
  .string()
  .trim()
  .min(1, { message: "اختر تصنيفًا" })
  .regex(/^[a-fA-F0-9]{24}$/, { message: "معرّف التصنيف غير صالح" });

/** POST /transaction */
export const createTransactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "العنوان مطلوب" })
    .max(120, { message: "العنوان طويل جدًا" }),
  amount: z.coerce
    .number({ message: "المبلغ مطلوب" })
    .finite({ message: "المبلغ غير صالح" })
    .gt(0, { message: "المبلغ يجب أن يكون أكبر من صفر" }),
  category: objectIdSchema,
  date: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: "صيغة التاريخ يجب أن تكون YYYY-MM-DD",
    }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateTransactionFormValues = z.input<typeof createTransactionSchema>;

export const reportTypeSchema = z.enum(["day", "month"]);

/** Report form: current month | day | specific month */
export const reportQuerySchema = z
  .object({
    mode: z.enum(["current", "day", "month"]),
    date: z.string().optional(),
    month: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === "day") {
      if (!value.date || !/^\d{4}-\d{2}-\d{2}$/.test(value.date)) {
        ctx.addIssue({
          code: "custom",
          path: ["date"],
          message: "التاريخ مطلوب لتقرير يومي (YYYY-MM-DD)",
        });
      }
    }
    if (value.mode === "month") {
      if (!value.month || !/^\d{4}-\d{2}$/.test(value.month)) {
        ctx.addIssue({
          code: "custom",
          path: ["month"],
          message: "الشهر مطلوب لتقرير شهري (YYYY-MM)",
        });
      }
    }
  });

export type ReportQueryFormValues = z.infer<typeof reportQuerySchema>;

export type TransactionCategoryRef = {
  _id: string;
  name: string;
  type?: z.infer<typeof categoryTypeSchema>;
  typeLabel?: string;
};

export type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string | TransactionCategoryRef;
};

export type TransactionListData = {
  transactions: Transaction[];
  page: number;
  limit: number;
  total: number;
  /** True when another page is available (even if total is approximate). */
  hasMore?: boolean;
  /** True when `total` came from the API (not inferred from page size). */
  totalReliable?: boolean;
};

export type SummaryCategoryRow = {
  category: { _id: string; name: string };
  count: number;
  total: number;
};

export type TransactionSummaryData = {
  expense: SummaryCategoryRow[];
  income: SummaryCategoryRow[];
  savings: SummaryCategoryRow[];
};

export type TransactionReportData = TransactionSummaryData & {
  totalExpense: number;
  totalIncome: number;
  totalSavings: number;
};

export type ListTransactionsParams = {
  page?: number;
  limit?: number;
  categoryType?: "income" | "expense" | "savings";
  categoryName?: string;
  month?: string;
};

export type ReportParams =
  | Record<string, never>
  | { type: "day"; date: string }
  | { type: "month"; month: string };
