type UserAvatarProps = {
  name: string;
  imageUrl?: string | null;
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

/** Avatar from profile image URL, or initials fallback. */
export default function UserAvatar({
  name,
  imageUrl,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const baseClass = [
    "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-purple font-extrabold text-white shadow-sm overflow-hidden",
    sizeClass[size],
    className,
  ].join(" ");

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote Cloudinary URLs; no next/image remotePatterns yet
      <img
        src={imageUrl}
        alt={name ? `صورة ${name}` : "صورة الحساب"}
        className={`${baseClass} object-cover`}
      />
    );
  }

  return (
    <span className={baseClass} aria-hidden>
      {initialsFromName(name)}
    </span>
  );
}
