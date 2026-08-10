import type { ReactNode } from "react";

export type CategoryCardData = {
  id: string;
  name: string;
  countLabel: string;
  total: string;
  iconBg: string;
  icon: ReactNode;
  accentBorder: string;
  totalClass: string;
};

type CategoryCardProps = {
  category: CategoryCardData;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article
      className={[
        "rounded-2xl border border-card-border bg-surface shadow-sm p-4 sm:p-5 text-start",
        "border-s-4",
        category.accentBorder,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${category.iconBg}`}
        >
          {category.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-text-main truncate">{category.name}</h3>
          <p className="mt-1 text-xs font-medium text-text-muted">{category.countLabel}</p>
          <p className={`mt-3 text-sm font-extrabold ${category.totalClass}`}>
            إجمالي: {category.total}
          </p>
        </div>
      </div>
    </article>
  );
}
