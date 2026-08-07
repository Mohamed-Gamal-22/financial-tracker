"use client";

import { Suspense } from "react";
import DashboardShowcase from "./components/DashboardShowcase";
import LoginHeader from "./components/LoginHeader";
import LoginFooter from "./components/LoginFooter";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <main className="min-h-screen flex bg-gradient-to-br from-bg-start to-bg-end relative overflow-hidden">
      <div className="absolute top-[-10%] end-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] start-[-10%] w-[500px] h-[500px] bg-purple/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <section className="w-full lg:w-[450px] xl:w-[500px] bg-card-bg border-e border-card-border backdrop-blur-xl flex flex-col justify-center p-8 sm:p-12 relative z-10 shadow-2xl">
        <div className="my-6">
          <LoginHeader />
          <Suspense
            fallback={
              <p className="text-sm font-bold text-text-muted text-center">
                جاري التحميل...
              </p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <LoginFooter />
      </section>

      <DashboardShowcase />
    </main>
  );
}
