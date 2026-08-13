"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import { getCategories } from "@/services/api/category";
import { ApiError } from "@/services/api/types";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesGrid from "./components/CategoriesGrid";

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل التصنيفات";

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="categories"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
          <CategoriesHeader onOpenSidebar={() => setSidebarOpen(true)} />

          {isLoading ? (
            <div className="rounded-2xl border border-card-border bg-surface/90 p-10 text-center">
              <p className="text-sm font-bold text-text-muted">
                جاري تحميل التصنيفات...
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-card-border bg-surface/60 p-10 text-center">
              <p className="text-sm font-bold text-text-muted">
                لا توجد تصنيفات متاحة حاليًا
              </p>
            </div>
          ) : (
            <CategoriesGrid categories={categories} />
          )}
        </div>
      </main>
    </div>
  );
}
