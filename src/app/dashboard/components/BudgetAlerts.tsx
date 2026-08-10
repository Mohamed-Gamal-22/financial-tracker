const ALERTS = [
  {
    id: "shopping",
    title: "ميزانية التسوق",
    percent: 85,
    barClass: "bg-accent-danger",
    message: "لقد اقتربت من تجاوز الحد المسموح به هذا الشهر",
    messageClass: "text-accent-danger",
  },
  {
    id: "entertainment",
    title: "ميزانية الترفيه",
    percent: 40,
    barClass: "bg-primary",
    message: "أنت ضمن الحد الآمن",
    messageClass: "text-primary",
  },
];

export default function BudgetAlerts() {
  return (
    <section className="rounded-2xl border border-card-border bg-surface shadow-sm p-5 sm:p-6 text-start h-full">
      <h2 className="text-base font-extrabold text-text-main mb-5">تنبيهات الميزانية</h2>

      <div className="space-y-5">
        {ALERTS.map((alert) => (
          <div key={alert.id}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-bold text-text-main">{alert.title}</p>
              <span className="text-sm font-extrabold text-text-main">{alert.percent}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-primary-tint overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${alert.barClass}`}
                style={{ width: `${alert.percent}%` }}
              />
            </div>
            <p className={`text-xs font-medium leading-relaxed ${alert.messageClass}`}>
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
