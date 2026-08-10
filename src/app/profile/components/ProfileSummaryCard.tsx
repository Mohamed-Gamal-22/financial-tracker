import UserAvatar from "@/components/UserAvatar";

type ProfileSummaryCardProps = {
  name: string;
  email: string;
};

export default function ProfileSummaryCard({
  name,
  email,
}: ProfileSummaryCardProps) {
  return (
    <aside className="rounded-2xl border border-card-border bg-surface shadow-sm p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <UserAvatar name={name} size="lg" className="h-28 w-28 text-3xl shadow-md" />
        <div className="space-y-1 min-w-0 w-full">
          <h2 className="text-lg font-extrabold text-text-main tracking-tight truncate">
            {name || "—"}
          </h2>
          <p className="text-sm font-medium text-text-muted truncate">
            {email || "—"}
          </p>
        </div>
      </div>
    </aside>
  );
}
