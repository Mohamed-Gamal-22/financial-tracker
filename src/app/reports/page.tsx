"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import DayPickerField from "@/components/date/DayPickerField";
import MonthPickerField from "@/components/date/MonthPickerField";
import { yearMonthFromPeriod } from "@/lib/date-value";
import { useAlert } from "@/app/(auth)/alerts";
import { getTransactionReport } from "@/services/api/transaction";
import { ApiError } from "@/services/api/types";
import { CATEGORY_TYPE_LABELS, type CategoryType } from "@/schemas/category.schema";
import {
  reportQuerySchema,
  type ReportParams,
  type ReportQueryFormValues,
  type Transaction,
} from "@/schemas/transaction.schema";
import {
  amountToneClass,
  formatDateAr,
  formatMoney,
} from "@/lib/format";
import {
  fetchReportTransactions,
  groupTransactionsByType,
} from "@/lib/report-transactions";

function transactionCountLabel(count: number) {
  if (count === 1) return "معاملة واحدة";
  if (count === 2) return "معاملتان";
  return `${count} معاملات`;
}

function ReportTypeSection({
  label,
  titleClass,
  type,
  items,
  isLoading,
}: {
  label: string;
  titleClass: string;
  type: CategoryType;
  items: Transaction[];
  isLoading?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
      <h3 className={`text-base font-extrabold mb-4 ${titleClass}`}>
        {label} — {isLoading ? "..." : transactionCountLabel(items.length)}
      </h3>
      {isLoading ? (
        <p className="text-sm font-medium text-text-muted">جاري تحميل المعاملات...</p>
      ) : items.length === 0 ? (
        <p className="text-sm font-medium text-text-muted">لا توجد معاملات</p>
      ) : (
        <ul className="space-y-3">
          {items.map((tx) => (
            <li
              key={tx._id}
              className="flex items-start justify-between gap-3 border-b border-card-border/60 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-main truncate">{tx.title}</p>
                <p className="text-xs font-medium text-text-muted mt-0.5">
                  {formatDateAr(tx.date)}
                </p>
              </div>
              <p
                className={`text-sm font-extrabold shrink-0 ${amountToneClass(type)}`}
              >
                {formatMoney(tx.amount, { type, withSign: true })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function toReportParams(values: ReportQueryFormValues): ReportParams {
  if (values.mode === "day" && values.date) {
    return { type: "day", date: values.date };
  }
  if (values.mode === "month" && values.month) {
    return { type: "month", month: values.month };
  }
  return {};
}

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showAlert } = useAlert();
  const [appliedParams, setAppliedParams] = useState<ReportParams>({});

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ReportQueryFormValues>({
    defaultValues: { mode: "current", date: "", month: "" },
    resolver: zodResolver(reportQuerySchema),
  });

  const mode = watch("mode");

  useEffect(() => {
    if (mode === "current") {
      setAppliedParams({});
    }
  }, [mode]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["transaction-report", appliedParams],
    queryFn: async () => {
      const response = await getTransactionReport(appliedParams);
      return response.data;
    },
  });

  const {
    data: reportTransactions,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ["report-transactions", appliedParams],
    queryFn: () => fetchReportTransactions(appliedParams),
    enabled: Boolean(data),
  });

  const grouped = useMemo(
    () => groupTransactionsByType(reportTransactions ?? []),
    [reportTransactions],
  );

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل التقرير";

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="reports"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
          <div className="flex items-start gap-3 text-start">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
              className="lg:hidden mt-1 p-2 rounded-xl border border-card-border/60 bg-surface hover:bg-primary-tint/40 text-text-main transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
                التقارير
              </h1>
              <p className="mt-1 text-sm font-medium text-text-muted">
                إجماليات مالية مع تفاصيل المعاملات لكل نوع
              </p>
            </div>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit((values) => {
              setAppliedParams(toReportParams(values));
            })}
            className="rounded-2xl border border-card-border bg-surface/90 p-4 sm:p-5 space-y-4 text-start"
          >
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "current", label: "الشهر الحالي" },
                  { id: "day", label: "يوم محدد" },
                  { id: "month", label: "شهر محدد" },
                ] as const
              ).map((option) => (
                <label
                  key={option.id}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold cursor-pointer border",
                    mode === option.id
                      ? "bg-primary text-text-inverse border-primary"
                      : "bg-surface text-text-main border-card-border",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    value={option.id}
                    className="sr-only"
                    {...register("mode")}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {mode === "day" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">التاريخ</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-full max-w-xs min-w-0">
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DayPickerField
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="اختر التاريخ"
                        />
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    عرض التقرير
                  </button>
                </div>
                {errors.date && (
                  <p className="text-accent-danger text-xs font-medium">{errors.date.message}</p>
                )}
              </div>
            )}

            {mode === "month" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">الشهر</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-full max-w-xs min-w-0">
                    <Controller
                      name="month"
                      control={control}
                      render={({ field }) => (
                        <MonthPickerField
                          value={field.value ?? ""}
                          onChange={(value) =>
                            field.onChange(yearMonthFromPeriod(value) || value)
                          }
                          placeholder="اختر الشهر"
                        />
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    عرض التقرير
                  </button>
                </div>
                {errors.month && (
                  <p className="text-accent-danger text-xs font-medium">{errors.month.message}</p>
                )}
              </div>
            )}
          </form>

          {isLoading ? (
            <div className="rounded-2xl border border-card-border bg-surface p-10 text-center">
              <p className="text-sm font-bold text-text-muted">جاري تحميل التقرير...</p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  showAlert({ message: errorMessage, success: false });
                  void refetch();
                }}
                disabled={isFetching}
                className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <article className="rounded-2xl border border-card-border bg-surface p-5">
                  <p className="text-xs font-bold text-text-muted mb-2">
                    إجمالي {CATEGORY_TYPE_LABELS.income}
                  </p>
                  <p className="text-xl font-extrabold text-accent-success">
                    {formatMoney(data.totalIncome ?? 0)}
                  </p>
                </article>
                <article className="rounded-2xl border border-card-border bg-surface p-5">
                  <p className="text-xs font-bold text-text-muted mb-2">
                    إجمالي {CATEGORY_TYPE_LABELS.expense}
                  </p>
                  <p className="text-xl font-extrabold text-accent-danger">
                    {formatMoney(data.totalExpense ?? 0)}
                  </p>
                </article>
                <article className="rounded-2xl border border-card-border bg-surface p-5">
                  <p className="text-xs font-bold text-text-muted mb-2">
                    إجمالي {CATEGORY_TYPE_LABELS.savings}
                  </p>
                  <p className="text-xl font-extrabold text-sky">
                    {formatMoney(data.totalSavings ?? 0)}
                  </p>
                </article>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ReportTypeSection
                  label={CATEGORY_TYPE_LABELS.income}
                  titleClass="text-accent-success"
                  type="income"
                  items={grouped.income}
                  isLoading={transactionsLoading}
                />
                <ReportTypeSection
                  label={CATEGORY_TYPE_LABELS.expense}
                  titleClass="text-accent-danger"
                  type="expense"
                  items={grouped.expense}
                  isLoading={transactionsLoading}
                />
                <ReportTypeSection
                  label={CATEGORY_TYPE_LABELS.savings}
                  titleClass="text-sky"
                  type="savings"
                  items={grouped.savings}
                  isLoading={transactionsLoading}
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
