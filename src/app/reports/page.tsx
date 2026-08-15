"use client";

import { useState } from "react";
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
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";
import {
  reportQuerySchema,
  type ReportParams,
  type ReportQueryFormValues,
  type SummaryCategoryRow,
} from "@/schemas/transaction.schema";
import { formatMoney } from "@/lib/format";

function Section({
  title,
  titleClass,
  rows,
}: {
  title: string;
  titleClass: string;
  rows: SummaryCategoryRow[];
}) {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 text-start">
      <h3 className={`text-base font-extrabold mb-4 ${titleClass}`}>{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm font-medium text-text-muted">لا توجد بيانات</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.category?._id ?? row.category?.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-main truncate">
                  {row.category?.name ?? "—"}
                </p>
                <p className="text-xs font-medium text-text-muted mt-0.5">
                  {row.count} معاملة
                </p>
              </div>
              <p className="text-sm font-extrabold text-text-main shrink-0">
                {formatMoney(row.total)}
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

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["transaction-report", appliedParams],
    queryFn: async () => {
      const response = await getTransactionReport(appliedParams);
      return response.data;
    },
  });

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
                تقرير مالي مجمّع حسب التصنيف مع الإجماليات
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
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs font-bold text-text-main block">التاريخ</label>
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
                {errors.date && (
                  <p className="text-accent-danger text-xs font-medium">{errors.date.message}</p>
                )}
              </div>
            )}

            {mode === "month" && (
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs font-bold text-text-main block">الشهر</label>
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
                {errors.month && (
                  <p className="text-accent-danger text-xs font-medium">{errors.month.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 shadow-lg shadow-primary/20 cursor-pointer"
            >
              عرض التقرير
            </button>
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
                <Section
                  title={CATEGORY_TYPE_LABELS.expense}
                  titleClass="text-accent-danger"
                  rows={data.expense ?? []}
                />
                <Section
                  title={CATEGORY_TYPE_LABELS.income}
                  titleClass="text-accent-success"
                  rows={data.income ?? []}
                />
                <Section
                  title={CATEGORY_TYPE_LABELS.savings}
                  titleClass="text-sky"
                  rows={data.savings ?? []}
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
