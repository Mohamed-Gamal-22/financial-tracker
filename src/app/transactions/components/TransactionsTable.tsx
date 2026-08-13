"use client";

import type { Transaction } from "@/schemas/transaction.schema";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";
import {
  amountToneClass,
  categoryTypeOf,
  formatDateAr,
  formatMoney,
  resolveCategory,
} from "@/lib/format";

type TransactionsTableProps = {
  transactions: Transaction[];
  page: number;
  limit: number;
  total: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onOpenDetail: (id: string) => void;
  onDelete: (id: string, title: string) => void;
};

function badgeClass(type?: string) {
  if (type === "income") return "bg-accent-success/15 text-accent-success";
  if (type === "savings") return "bg-sky/15 text-sky";
  return "bg-accent-danger/10 text-accent-danger";
}

export default function TransactionsTable({
  transactions,
  page,
  limit,
  total,
  isLoading,
  onPageChange,
  onOpenDetail,
  onDelete,
}: TransactionsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5,
  );

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm overflow-hidden text-start">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-card-border/70 bg-primary-tint/30">
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">التاريخ</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">الوصف</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">الفئة</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">المبلغ</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm font-bold text-text-muted">
                  جاري تحميل المعاملات...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm font-bold text-text-muted">
                  لا توجد معاملات مطابقة
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const category = resolveCategory(tx.category);
                const type = categoryTypeOf(tx.category);
                return (
                  <tr
                    key={tx._id}
                    className="border-b border-card-border/50 last:border-b-0 hover:bg-primary-tint/20 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-text-muted whitespace-nowrap">
                      {formatDateAr(tx.date)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(tx._id)}
                        className="text-sm font-bold text-text-main hover:text-primary transition-colors cursor-pointer text-start truncate max-w-[220px]"
                      >
                        {tx.title}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeClass(type)}`}
                      >
                        <span className="size-1.5 rounded-full bg-current opacity-80" />
                        {category?.name ?? "—"}
                        {type ? ` · ${CATEGORY_TYPE_LABELS[type]}` : ""}
                      </span>
                    </td>
                    <td className={`px-5 py-4 text-sm font-extrabold whitespace-nowrap ${amountToneClass(type)}`}>
                      {formatMoney(tx.amount, { type, withSign: true })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(tx._id)}
                          className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer"
                        >
                          تفاصيل
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(tx._id, tx.title)}
                          className="text-xs font-bold text-accent-danger hover:opacity-80 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-card-border/60 px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs font-bold text-text-muted">
          صفحة {page} من {totalPages} — إجمالي {total} من المعاملات
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!canPrev || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-bold text-text-main hover:bg-primary-tint/40 disabled:opacity-40 cursor-pointer"
          >
            السابق
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange(n)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer",
                n === page
                  ? "bg-primary text-text-inverse"
                  : "border border-card-border text-text-main hover:bg-primary-tint/40",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={!canNext || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-bold text-text-main hover:bg-primary-tint/40 disabled:opacity-40 cursor-pointer"
          >
            التالي
          </button>
        </div>
      </div>
    </section>
  );
}
