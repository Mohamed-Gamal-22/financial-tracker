"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import DashboardTopBar from "./components/DashboardTopBar";
import DashboardStats from "./components/DashboardStats";
import SpendingChart from "./components/SpendingChart";
import ExpenseCategories from "./components/ExpenseCategories";
import RecentTransactions from "./components/RecentTransactions";
import BudgetAlerts from "./components/BudgetAlerts";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="home"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        <DashboardTopBar onOpenSidebar={() => setSidebarOpen(true)} />

        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-8">
          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] gap-5">
            <SpendingChart />
            <ExpenseCategories />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] gap-5">
            <RecentTransactions />
            <BudgetAlerts />
          </div>
        </div>
      </main>
    </div>
  );
}
