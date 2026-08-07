import Link from "next/link";

export default function ForgotPasswordFooter() {
  return (
    <footer className="text-center text-xs text-text-muted select-none">
      تذكرت كلمة المرور؟{" "}
      <Link
        href="/login"
        className="text-primary hover:text-primary-hover font-bold transition-colors"
      >
        تسجيل الدخول
      </Link>
    </footer>
  );
}
