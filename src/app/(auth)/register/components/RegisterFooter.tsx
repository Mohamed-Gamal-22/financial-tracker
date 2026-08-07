import Link from "next/link";

export default function RegisterFooter() {
  return (
    <footer className="text-center text-xs text-text-muted select-none">
      لديك حساب بالفعل؟{" "}
      <Link
        href="/login"
        className="text-primary hover:text-primary-hover font-bold transition-colors"
      >
        تسجيل الدخول
      </Link>
    </footer>
  );
}
