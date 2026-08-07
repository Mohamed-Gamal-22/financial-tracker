type RegisterHeaderProps = {
  step: "signup" | "otp";
  email?: string;
};

export default function RegisterHeader({ step, email }: RegisterHeaderProps) {
  return (
    <div className="space-y-2 mb-6 text-start">
      <h1 className="font-sans font-extrabold flex justify-between w-full items-center text-3xl text-text-main tracking-tight select-none">
        {step === "signup" ? "إنشاء حساب" : "تأكيد البريد"}
        <img src="/logo.png" className="w-24" alt="" />
      </h1>
      <p className="text-text-muted text-sm font-medium">
        {step === "signup"
          ? "ابدأ في تنظيم مصروفاتك وتوفير أموالك بكل سهولة."
          : `أدخل رمز التحقق المرسل إلى ${email}`}
      </p>
    </div>
  );
}
