import type { ReactNode } from "react";

type TransactionRow = {
  id: string;
  date: string;
  title: string;
  category: string;
  categoryTone: string;
  amount: string;
  amountClass: string;
  iconBg: string;
  icon: ReactNode;
};

const ROWS: TransactionRow[] = [
  {
    id: "1",
    date: "12 أكتوبر 2023",
    title: "راتب شهري",
    category: "دخل",
    categoryTone: "bg-primary-tint text-primary",
    amount: "+ 12,500 ج.م",
    amountClass: "text-accent-success",
    iconBg: "bg-accent-success/15 text-accent-success",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "2",
    date: "10 أكتوبر 2023",
    title: "عشاء في المطعم",
    category: "طعام",
    categoryTone: "bg-accent-danger/10 text-accent-danger",
    amount: "- 350 ج.م",
    amountClass: "text-text-main",
    iconBg: "bg-accent-danger/10 text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v18m0-18a4 4 0 014 4v2H8V7a4 4 0 014-4zm-6 9h12v2a4 4 0 01-4 4h-4a4 4 0 01-4-4v-2z"
        />
      </svg>
    ),
  },
  {
    id: "3",
    date: "08 أكتوبر 2023",
    title: "وقود السيارة",
    category: "نقل",
    categoryTone: "bg-sky/15 text-sky",
    amount: "- 120 ج.م",
    amountClass: "text-text-main",
    iconBg: "bg-sky/15 text-sky",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3h8v4M7 7h10v11a2 2 0 01-2 2H9a2 2 0 01-2-2V7zm10 4h2a2 2 0 012 2v3a2 2 0 01-2 2h-2"
        />
      </svg>
    ),
  },
];

export default function TransactionsTable() {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm overflow-hidden text-start">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-card-border/70 bg-primary-tint/30">
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">التاريخ</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">الوصف</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">الفئة</th>
              <th className="px-5 py-3.5 text-xs font-bold text-text-muted">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.id}
                className="border-b border-card-border/50 last:border-b-0 hover:bg-primary-tint/20 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-text-muted whitespace-nowrap">
                  {row.date}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${row.iconBg}`}
                    >
                      {row.icon}
                    </span>
                    <span className="text-sm font-bold text-text-main truncate">{row.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${row.categoryTone}`}
                  >
                    <span className="size-1.5 rounded-full bg-current opacity-80" />
                    {row.category}
                  </span>
                </td>
                <td className={`px-5 py-4 text-sm font-extrabold whitespace-nowrap ${row.amountClass}`}>
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-card-border/60 py-4 text-center">
        <button
          type="button"
          className="text-sm font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          عرض المزيد
        </button>
      </div>
    </section>
  );
}
