import type { ReactNode } from "react";
import CategoryCard, { type CategoryCardData } from "./CategoryCard";

type CategoryColumnProps = {
  title: string;
  titleIcon: ReactNode;
  titleClass: string;
  categories: CategoryCardData[];
};

export default function CategoryColumn({
  title,
  titleIcon,
  titleClass,
  categories,
}: CategoryColumnProps) {
  return (
    <section className="space-y-4 text-start">
      <div className={`flex items-center gap-2 ${titleClass}`}>
        {titleIcon}
        <h2 className="text-base font-extrabold">{title}</h2>
      </div>
      <div className="space-y-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
