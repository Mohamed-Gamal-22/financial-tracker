"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesGrid from "./components/CategoriesGrid";

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <CategoriesGrid />
        </div>
      </main>
    </div>
  );
}
