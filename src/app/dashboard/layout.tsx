import RequireAuth from "@/components/auth/RequireAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
