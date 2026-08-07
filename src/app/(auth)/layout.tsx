import GuestOnly from "@/components/auth/GuestOnly";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestOnly>{children}</GuestOnly>;
}
