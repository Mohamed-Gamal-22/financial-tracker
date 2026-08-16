import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مصروفي - إدارة المصاريف والميزانية الذكية",
  description: "منصة مصروفي لإدارة وتتبع الأموال والتدفقات النقدية والميزانيات بسهولة وذكاء.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
