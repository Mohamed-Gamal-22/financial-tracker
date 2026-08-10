import type { CategoryCardData } from "./CategoryCard";
import CategoryColumn from "./CategoryColumn";

const INCOME_CATEGORIES: CategoryCardData[] = [
  {
    id: "salary",
    name: "راتب أساسي",
    countLabel: "1 معاملة هذا الشهر",
    total: "15,000 ج.م",
    iconBg: "bg-accent-success/15 text-accent-success",
    accentBorder: "border-s-accent-success",
    totalClass: "text-accent-success",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: "freelance",
    name: "عمل حر",
    countLabel: "3 معاملات هذا الشهر",
    total: "4,200 ج.م",
    iconBg: "bg-sky/15 text-sky",
    accentBorder: "border-s-sky",
    totalClass: "text-accent-success",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const EXPENSE_CATEGORIES: CategoryCardData[] = [
  {
    id: "food",
    name: "طعام ومشروبات",
    countLabel: "25 معاملة هذا الشهر",
    total: "2,500 ج.م",
    iconBg: "bg-orange-100 text-orange-500",
    accentBorder: "border-s-orange-400",
    totalClass: "text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v18m0-18a4 4 0 014 4v2H8V7a4 4 0 014-4zm-6 9h12v2a4 4 0 01-4 4h-4a4 4 0 01-4-4v-2z"
        />
      </svg>
    ),
  },
  {
    id: "housing",
    name: "سكن وإيجار",
    countLabel: "1 معاملة هذا الشهر",
    total: "4,000 ج.م",
    iconBg: "bg-primary-tint text-primary",
    accentBorder: "border-s-primary",
    totalClass: "text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 013 20V10.5z" />
      </svg>
    ),
  },
  {
    id: "shopping",
    name: "تسوق",
    countLabel: "8 معاملات هذا الشهر",
    total: "1,200 ج.م",
    iconBg: "bg-purple/15 text-purple",
    accentBorder: "border-s-purple",
    totalClass: "text-accent-danger",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 11H6L5 9z"
        />
      </svg>
    ),
  },
];

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <CategoryColumn
        title="المصروفات"
        titleClass="text-accent-danger"
        titleIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2 4 4 6 6 6s4-2 6-6 4-6 6-6" />
          </svg>
        }
        categories={EXPENSE_CATEGORIES}
      />
      <CategoryColumn
        title="الدخل"
        titleClass="text-accent-success"
        titleIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2-4 4-6 6-6s4 2 6 6 4 6 6 6" />
          </svg>
        }
        categories={INCOME_CATEGORIES}
      />
    </div>
  );
}
