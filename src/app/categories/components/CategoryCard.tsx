import type { ReactNode } from "react";
import type { CategoryType } from "@/schemas/category.schema";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";

export type CategoryCardData = {
  id: string;
  name: string;
  type: CategoryType;
  iconBg: string;
  icon: ReactNode;
  accentBorder: string;
  badgeClass: string;
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
          <h3 className="text-sm font-extrabold text-text-main truncate">
            {category.name}
          </h3>
          <span
            className={`mt-1.5 inline-flex rounded-lg px-2 py-0.5 text-[11px] font-bold ${category.badgeClass}`}
          >
            {CATEGORY_TYPE_LABELS[category.type]}
          </span>
        </div>
      </div>
    </article>
  );
}
