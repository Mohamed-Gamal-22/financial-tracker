"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f4f7fb",
          color: "#0f172a",
          padding: 16,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            background: "#fff",
            padding: 24,
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>حدث خطأ</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            {error.message?.trim() || "تعذر تحميل التطبيق. حدّث الصفحة."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              border: 0,
              borderRadius: 12,
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
