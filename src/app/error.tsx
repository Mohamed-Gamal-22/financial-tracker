"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-start to-bg-end px-4">
      <div className="w-full max-w-md rounded-2xl border border-card-border bg-surface p-6 text-center shadow-sm">
        <h1 className="text-xl font-extrabold text-text-main">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-sm font-medium text-text-muted leading-relaxed">
          {error.message?.trim() || "تعذر إكمال العملية. حاول مرة أخرى."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-5 py-2.5 transition-colors cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
