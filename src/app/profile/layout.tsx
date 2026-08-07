import RequireAuth from "@/components/auth/RequireAuth";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
