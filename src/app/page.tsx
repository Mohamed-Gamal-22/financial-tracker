import React from "react";
import RedirectIfAuthenticated from "@/components/auth/RedirectIfAuthenticated";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Calculator from "./_components/Calculator";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import FinalCTA from "./_components/FinalCTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen  relative text-text-main overflow-x-hidden flex flex-col font-sans">
        <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-50 bg-sky/20 rounded-full blur-[100px] pointer-events-none select-none" />
        <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-50 bg-purple/20 rounded-full blur-[100px] pointer-events-none select-none" />
        <div className="absolute bottom-[5%] end-[-10%] w-[550px] h-[550px] -z-50 bg-purple/5 rounded-full blur-[100px] pointer-events-none select-none" />

        <Navbar />
        <Hero />
        <Calculator />
        <Features />
        <HowItWorks />
        <FinalCTA />
        <Footer />
      </div>
    </RedirectIfAuthenticated>
  );
}
