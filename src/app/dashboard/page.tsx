"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import OnboardingFlowModal, {
  type OnboardingStep,
} from "@/components/OnboardingFlowModal";
import MonthPickerField from "@/components/date/MonthPickerField";
import { useAuth } from "@/hooks/useAuth";
import { yearMonthFromPeriod } from "@/lib/date-value";
import { currentYearMonth } from "@/lib/format";
import {
  isOnboardingFlowDismissed,
  markOnboardingFlowDismissed,
} from "@/lib/onboarding-flow";
import CreateTransactionModal from "@/app/transactions/components/CreateTransactionModal";
import DashboardTopBar from "./components/DashboardTopBar";
import DashboardStats from "./components/DashboardStats";
import SpendingChart from "./components/SpendingChart";
import ExpenseCategories from "./components/ExpenseCategories";
import RecentTransactions from "./components/RecentTransactions";
import BudgetAlerts from "./components/BudgetAlerts";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const userKey = user?.id || user?.email || null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(currentYearMonth);
  const [flowOpen, setFlowOpen] = useState(false);
  const [flowStep, setFlowStep] = useState<OnboardingStep>(1);
  const [incomeOpen, setIncomeOpen] = useState(false);

  useEffect(() => {
    const calendarMonth = currentYearMonth();
    if (!isOnboardingFlowDismissed(userKey, calendarMonth)) {
      setFlowOpen(true);
      setFlowStep(1);
    }
  }, [userKey]);

  const dismissFlow = useCallback(() => {
    markOnboardingFlowDismissed(userKey, currentYearMonth());
    setFlowOpen(false);
    setIncomeOpen(false);
    setSidebarOpen(false);
  }, [userKey]);

  const goToStep2 = useCallback(() => {
    setIncomeOpen(false);
    setFlowStep(2);
    setFlowOpen(true);
  }, []);

  const highlightingTransactions = flowOpen && flowStep === 2;

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="home"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        highlightItem={highlightingTransactions ? "transactions" : undefined}
        onHighlightClick={dismissFlow}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        <DashboardTopBar onOpenSidebar={() => setSidebarOpen(true)} />

        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-8">
          <div className="flex justify-end">
            <MonthPickerField
              compact
              monthOnly
              compactLabel="الشهر"
              value={month}
              onChange={(value) =>
                setMonth(yearMonthFromPeriod(value) || value)
              }
              placeholder="اختر الشهر"
            />
          </div>

          <DashboardStats month={month} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] gap-5">
            <SpendingChart month={month} />
            <ExpenseCategories month={month} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] gap-5">
            <RecentTransactions month={month} />
            <BudgetAlerts month={month} />
          </div>
        </div>
      </main>

      <OnboardingFlowModal
        open={flowOpen && !incomeOpen}
        step={flowStep}
        onAddIncome={() => setIncomeOpen(true)}
        onNextStep={goToStep2}
        onGoToTransactions={() => {
          dismissFlow();
          router.push("/transactions?add=1");
        }}
        onDismiss={dismissFlow}
      />

      <CreateTransactionModal
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
        categoryTypeFilter="income"
        heading="إضافة دخل الشهر"
        description="سجّل راتبك أو أي مصدر دخل لهذا الشهر قبل إضافة المصروفات"
        submitLabel="حفظ الدخل"
        onCreated={goToStep2}
      />
    </div>
  );
}
