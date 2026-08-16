"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { ApiError } from "@/services/api/types";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import PersonalInfoSection from "./components/PersonalInfoSection";
import AccountSettingsSection from "./components/AccountSettingsSection";
import LogoutSection from "./components/LogoutSection";
import FreezeAccountSection from "./components/FreezeAccountSection";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    profile,
    user: sessionUser,
    displayName,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUserProfile();

  const fullname = profile?.fullname || displayName || sessionUser?.fullname || "";
  const email = profile?.email || sessionUser?.email || "";
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "تعذر تحميل بيانات الحساب";

  return (
    <div className="min-h-screen flex relative text-text-main overflow-x-hidden font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-10 bg-sky/15 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-10 bg-purple/15 rounded-full blur-[100px] pointer-events-none select-none" />

      <AppSidebar
        activeItem="profile"
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <ProfileHeader onOpenSidebar={() => setSidebarOpen(true)} />

          {isLoading ? (
            <div className="rounded-2xl border border-card-border bg-surface/90 p-10 text-center">
              <p className="text-sm font-bold text-text-muted">جاري تحميل بيانات الحساب...</p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-accent-danger/25 bg-accent-danger/5 p-8 text-center space-y-4">
              <p className="text-sm font-bold text-accent-danger">{errorMessage}</p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-bold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isFetching ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
              <ProfileSummaryCard
                name={fullname}
                email={email}
                profilePic={profile?.profilePic}
              />

              <div className="rounded-2xl border border-card-border bg-surface/90 backdrop-blur-sm shadow-sm p-5 sm:p-7 space-y-8">
                <PersonalInfoSection fullname={fullname} email={email} />
                <AccountSettingsSection />

                <div className="border-t border-card-border/70 pt-6">
                  <LogoutSection />
                </div>

                <div className="border-t border-card-border/70 pt-6">
                  <FreezeAccountSection />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
