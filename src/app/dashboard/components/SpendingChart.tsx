"use client";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/api/transaction";
import { currentYearMonth, formatMoney, sumTotals } from "@/lib/format";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LABELS = ["دخل", "مصروف", "ادخار"];
const COLORS = ["#22c55e", "#ef4444", "#38bdf8"];

function monthLabel(month: string) {
  return month === currentYearMonth() ? "هذا الشهر" : month;
}

function emptyChartMessage(month: string) {
  if (month === currentYearMonth()) {
    return "لا توجد بيانات لهذا الشهر";
  }
  return `لا توجد بيانات لـ ${month}`;
}

const sharedTooltip = {
  callbacks: {
    label: (ctx: { label?: string; parsed: number | { y: number | null } }) => {
      const value =
        typeof ctx.parsed === "number" ? ctx.parsed : (ctx.parsed.y ?? 0);
      return `${ctx.label ?? ""}: ${formatMoney(value)}`;
    },
  },
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 14,
        font: { family: "inherit", size: 12, weight: "bold" },
        color: "#4b5563",
      },
    },
    tooltip: sharedTooltip,
  },
};

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: sharedTooltip,
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: "inherit", size: 12, weight: "bold" },
        color: "#4b5563",
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(59, 124, 246, 0.08)" },
      ticks: {
        font: { family: "inherit", size: 11 },
        color: "#8b8f9b",
        callback: (value) => Number(value).toLocaleString("ar-EG"),
      },
    },
  },
};

export default function SpendingChart({ month }: { month: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transaction-summary", month],
    queryFn: async () => (await getTransactionSummary(month)).data,
  });

  const income = sumTotals(data?.income);
  const expense = sumTotals(data?.expense);
  const savings = sumTotals(data?.savings);
  const values = [income, expense, savings];
  const hasData = values.some((v) => v > 0);

  const chartData = {
    labels: LABELS,
    datasets: [
      {
        label: "المبلغ",
        data: values,
        backgroundColor: COLORS,
        borderWidth: 0,
        borderRadius: 8,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-extrabold text-text-main">تحليل الإنفاق</h2>
        <span className="inline-flex items-center rounded-lg border border-card-border bg-primary-tint/40 px-3 py-1.5 text-xs font-bold text-text-main">
          {monthLabel(month)}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted py-16 text-center">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger py-16 text-center">تعذر تحميل التحليل</p>
      ) : !hasData ? (
        <p className="text-sm font-bold text-text-muted py-16 text-center">{emptyChartMessage(month)}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          <div className="h-52 sm:h-56">
            <Doughnut data={chartData} options={doughnutOptions} />
          </div>
          <div className="h-52 sm:h-56">
            <Bar data={chartData} options={barOptions} />
          </div>
        </div>
      )}
    </section>
  );
}
