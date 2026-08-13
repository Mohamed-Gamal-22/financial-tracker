"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "@/services/api/transaction";
import {
  amountToneClass,
  categoryTypeOf,
  formatMoney,
  resolveCategory,
} from "@/lib/format";

export default function RecentTransactions() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const response = await listTransactions({ page: 1, limit: 5 });
      return response.data?.transactions ?? [];
    },
  });

  const transactions = data ?? [];

  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-extrabold text-text-main">أحدث المعاملات</h2>
        <Link
          href="/transactions"
          className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
        >
          عرض الكل
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm font-bold text-text-muted py-6">جاري التحميل...</p>
      ) : isError ? (
        <p className="text-sm font-bold text-accent-danger py-6">تعذر تحميل المعاملات</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm font-bold text-text-muted py-6">لا توجد معاملات بعد</p>
      ) : (
        <ul className="space-y-1">
          {transactions.map((tx) => {
            const category = resolveCategory(tx.category);
            const type = categoryTypeOf(tx.category);
            const initial = tx.title.trim().charAt(0) || "?";
            return (
              <li
                key={tx._id}
                className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-primary-tint/30 transition-colors"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold bg-primary/10 text-primary">
                  {initial}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-main truncate">{tx.title}</p>
                  <p className="text-xs font-medium text-text-muted mt-0.5">
                    {category?.name ?? "—"}
                  </p>
                </div>
                <p className={`text-sm font-extrabold shrink-0 ${amountToneClass(type)}`}>
                  {formatMoney(tx.amount, { type, withSign: true })}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
