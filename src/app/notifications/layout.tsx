import RequireAuth from "@/components/auth/RequireAuth";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
