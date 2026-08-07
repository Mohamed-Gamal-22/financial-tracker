type UserAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-24 w-24 text-2xl",
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/** Dummy avatar built from user initials (no external image dependency). */
export default function UserAvatar({
  name,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-purple font-extrabold text-white shadow-sm",
        sizeClass[size],
        className,
      ].join(" ")}
      aria-hidden
    >
      {initialsFromName(name)}
    </span>
  );
}
