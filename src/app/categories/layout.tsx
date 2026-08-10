import RequireAuth from "@/components/auth/RequireAuth";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
