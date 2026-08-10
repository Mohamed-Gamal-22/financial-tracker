import RequireAuth from "@/components/auth/RequireAuth";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
