type PersonalInfoSectionProps = {
  fullname: string;
  email: string;
};

export default function PersonalInfoSection({
  fullname,
  email,
}: PersonalInfoSectionProps) {
  const fields = [
    {
      id: "fullName",
      label: "الاسم الكامل",
      value: fullname,
      type: "text" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "email",
      label: "البريد الإلكتروني",
      value: email,
      type: "email" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="text-start">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <h3 className="text-base font-extrabold text-text-main">المعلومات الشخصية</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label htmlFor={field.id} className="text-text-main text-xs font-bold block">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
                {field.icon}
              </div>
              <input
                id={field.id}
                type={field.type}
                value={field.value || ""}
                readOnly
                className="w-full bg-input-bg border border-input-border focus:border-input-focus focus:ring-2 focus:ring-primary/20 rounded-xl ps-11 pe-4 py-3 text-sm text-text-main outline-none transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
