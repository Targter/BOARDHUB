import React from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { NavHeader } from "../../components/layout/landing/nav-header";
import { HeroSection } from "../../components/layout/landing/hero-section";
import { FeaturesSection } from "../../components/layout/landing/features-section";
import { FaqSection } from "../../components/layout/landing/faq-section";
import { Footer } from "../../components/layout/landing/footer";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavHeader />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
