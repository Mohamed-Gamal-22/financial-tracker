import type { ReactNode } from "react";
import CategoryCard, { type CategoryCardData } from "./CategoryCard";

type CategoryColumnProps = {
  title: string;
  titleIcon: ReactNode;
  titleClass: string;
  categories: CategoryCardData[];
  emptyLabel: string;
};

export default function CategoryColumn({
  title,
  titleIcon,
  titleClass,
  categories,
  emptyLabel,
}: CategoryColumnProps) {
  return (
    <section className="space-y-4 text-start">
      <div className={`flex items-center gap-2 ${titleClass}`}>
        {titleIcon}
        <h2 className="text-base font-extrabold">{title}</h2>
        <span className="ms-auto text-xs font-bold text-text-muted tabular-nums">
          {categories.length}
        </span>
      </div>
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border bg-surface/60 px-4 py-8 text-center">
            <p className="text-sm font-medium text-text-muted">{emptyLabel}</p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        )}
      </div>
    </section>
  );
}
