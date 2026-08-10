const TRANSACTIONS = [
  {
    id: "1",
    title: "دفع قسط الشقة",
    subtitle: "تحويل مباشر",
    amount: "-6,000.00 ج.م",
    amountClass: "text-accent-danger",
    initial: "س",
    tone: "bg-primary/10 text-primary",
  },
  {
    id: "2",
    title: "فاتورة المياه",
    subtitle: "مرافق",
    amount: "-350.00 ج.م",
    amountClass: "text-accent-danger",
    initial: "م",
    tone: "bg-sky/15 text-sky",
  },
  {
    id: "3",
    title: "راتب العمل",
    subtitle: "الشركة الرئيسية",
    amount: "+12,000.00 ج.م",
    amountClass: "text-accent-success",
    initial: "ر",
    tone: "bg-accent-success/10 text-accent-success",
  },
];

export default function RecentTransactions() {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-extrabold text-text-main">أحدث المعاملات</h2>
        <button
          type="button"
          className="text-sm font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          عرض الكل
        </button>
      </div>

      <ul className="space-y-1">
        {TRANSACTIONS.map((tx) => (
          <li
            key={tx.id}
            className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-primary-tint/30 transition-colors"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${tx.tone}`}
            >
              {tx.initial}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-main truncate">{tx.title}</p>
              <p className="text-xs font-medium text-text-muted mt-0.5">{tx.subtitle}</p>
            </div>
            <p className={`text-sm font-extrabold shrink-0 ${tx.amountClass}`}>{tx.amount}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
