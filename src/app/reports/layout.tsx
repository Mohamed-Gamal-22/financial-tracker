import RequireAuth from "@/components/auth/RequireAuth";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
