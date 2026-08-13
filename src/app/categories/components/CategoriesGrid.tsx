"use client";

import type { ReactNode } from "react";
import type { Category } from "@/services/api/category";
import type { CategoryType } from "@/schemas/category.schema";
import type { CategoryCardData } from "./CategoryCard";
import CategoryColumn from "./CategoryColumn";

const TYPE_STYLES: Record<
  CategoryType,
  {
    iconBg: string;
    accentBorder: string;
    badgeClass: string;
    icon: ReactNode;
  }
> = {
  income: {
    iconBg: "bg-accent-success/15 text-accent-success",
    accentBorder: "border-s-accent-success",
    badgeClass: "bg-accent-success/15 text-accent-success",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12c2-4 4-6 6-6s4 2 6 6 4 6 6 6"
        />
      </svg>
    ),
  },
  expense: {
    iconBg: "bg-accent-danger/15 text-accent-danger",
    accentBorder: "border-s-accent-danger",
    badgeClass: "bg-accent-danger/15 text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12c2 4 4 6 6 6s4-2 6-6 4-6 6-6"
        />
      </svg>
    ),
  },
  savings: {
    iconBg: "bg-sky/15 text-sky",
    accentBorder: "border-s-sky",
    badgeClass: "bg-sky/15 text-sky",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

function toCardData(category: Category): CategoryCardData {
  const style = TYPE_STYLES[category.type] ?? TYPE_STYLES.expense;
  return {
    id: category._id,
    name: category.name,
    type: category.type,
    iconBg: style.iconBg,
    accentBorder: style.accentBorder,
    badgeClass: style.badgeClass,
    icon: style.icon,
  };
}

type CategoriesGridProps = {
  categories: Category[];
};

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  const expense = categories
    .filter((c) => c.type === "expense")
    .map(toCardData);
  const income = categories
    .filter((c) => c.type === "income")
    .map(toCardData);
  const savings = categories
    .filter((c) => c.type === "savings")
    .map(toCardData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      <CategoryColumn
        title="المصروفات"
        titleClass="text-accent-danger"
        titleIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2 4 4 6 6 6s4-2 6-6 4-6 6-6" />
          </svg>
        }
        categories={expense}
        emptyLabel="لا توجد تصنيفات مصروفات"
      />
      <CategoryColumn
        title="الدخل"
        titleClass="text-accent-success"
        titleIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2-4 4-6 6-6s4 2 6 6 4 6 6 6" />
          </svg>
        }
        categories={income}
        emptyLabel="لا توجد تصنيفات دخل"
      />
      <CategoryColumn
        title="الادخار"
        titleClass="text-sky"
        titleIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        categories={savings}
        emptyLabel="لا توجد تصنيفات ادخار"
      />
    </div>
  );
}
