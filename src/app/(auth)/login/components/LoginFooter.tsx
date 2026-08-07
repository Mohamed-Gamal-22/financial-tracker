import Link from "next/link";

export default function LoginFooter() {
  return (
    <footer className="text-center text-xs text-text-muted select-none">
      ليس لديك حساب؟{" "}
      <Link
        href="/register"
        className="text-primary hover:text-primary-hover font-bold transition-colors"
      >
        أنشئ حسابًا جديدًا
      </Link>
    </footer>
  );
}
