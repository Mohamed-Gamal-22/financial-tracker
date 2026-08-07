type ForgotPasswordHeaderProps = {
  step: "forgot" | "reset";
  email?: string;
};

export default function ForgotPasswordHeader({
  step,
  email,
}: ForgotPasswordHeaderProps) {
  return (
    <div className="space-y-2 mb-6 text-start">
      <h1 className="font-sans font-extrabold flex justify-between w-full items-center text-3xl text-text-main tracking-tight select-none">
        {step === "forgot" ? "نسيت كلمة المرور" : "إعادة تعيين كلمة المرور"}
        <img src="/logo.png" className="w-24" alt="" />
      </h1>
      <p className="text-text-muted text-sm font-medium">
        {step === "forgot"
          ? "أدخل بريدك الإلكتروني لإرسال رمز التحقق."
          : `أدخل رمز التحقق المرسل إلى ${email} ثم كلمة المرور الجديدة.`}
      </p>
    </div>
  );
}
