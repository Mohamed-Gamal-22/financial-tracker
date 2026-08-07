"use client";

import { useState } from "react";
import RegisterShowcase from "./components/RegisterShowcase";
import RegisterHeader from "./components/RegisterHeader";
import RegisterFooter from "./components/RegisterFooter";
import SignupForm from "./components/SignupForm";
import ConfirmOtpForm from "./components/ConfirmOtpForm";

type Step = "signup" | "otp";

export default function Register() {
  const [step, setStep] = useState<Step>("signup");
  const [registeredEmail, setRegisteredEmail] = useState("");

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-bg-start to-bg-end relative overflow-hidden">
      <div className="absolute top-[-10%] end-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] start-[-10%] w-[500px] h-[500px] bg-purple/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <section className="w-full lg:w-[450px] xl:w-[500px] bg-card-bg border-e border-card-border backdrop-blur-xl flex flex-col justify-center p-8 sm:p-12 relative z-10 shadow-2xl">
        <div className="my-6">
          <RegisterHeader step={step} email={registeredEmail} />

          {step === "signup" ? (
            <SignupForm
              onSuccess={(email) => {
                setRegisteredEmail(email);
                setStep("otp");
              }}
            />
          ) : (
            <ConfirmOtpForm
              email={registeredEmail}
              onBack={() => setStep("signup")}
            />
          )}
        </div>

        <RegisterFooter />
      </section>

      <RegisterShowcase />
    </main>
  );
}
