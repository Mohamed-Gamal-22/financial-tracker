type UnreadCountBadgeProps = {
  count: number;
  className?: string;
};

export default function UnreadCountBadge({
  count,
  className = "absolute -top-1 -end-1",
}: UnreadCountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={[
        "min-w-4 h-4 px-1 rounded-full bg-accent-danger text-text-inverse text-[10px] font-extrabold leading-4 text-center",
        className,
      ].join(" ")}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
