import Link from "next/link";

export default function LoginHeader() {
  return (
    <div className="space-y-2 mb-8 text-start">
      <h1 className="font-sans font-extrabold text-3xl text-text-main tracking-tight">
        <Link
          href="/"
          className="flex justify-between w-full items-center"
        >
          تسجيل الدخول
          <img src="/logo.png" className="w-24" alt="" />
        </Link>
      </h1>
      <p className="text-text-muted text-sm font-medium">
        إدارة أموالك وتدفقاتك النقدية ومصاريفك الذكية.
      </p>
    </div>
  );
}
