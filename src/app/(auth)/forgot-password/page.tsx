"use client";

import { useState } from "react";
import DashboardShowcase from "../login/components/DashboardShowcase";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import ForgotPasswordFooter from "./components/ForgotPasswordFooter";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

type Step = "forgot" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("forgot");
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-bg-start to-bg-end relative overflow-hidden">
      <div className="absolute top-[-10%] end-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] start-[-10%] w-[500px] h-[500px] bg-purple/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <section className="w-full lg:w-[450px] xl:w-[500px] bg-card-bg border-e border-card-border backdrop-blur-xl flex flex-col justify-center p-8 sm:p-12 relative z-10 shadow-2xl">
        <div className="my-6">
          <ForgotPasswordHeader step={step} email={email} />

          {step === "forgot" ? (
            <ForgotPasswordForm
              onSuccess={(nextEmail) => {
                setEmail(nextEmail);
                setStep("reset");
              }}
            />
          ) : (
            <ResetPasswordForm
              email={email}
              onBack={() => setStep("forgot")}
            />
          )}
        </div>

        <ForgotPasswordFooter />
      </section>

      <DashboardShowcase />
    </main>
  );
}
