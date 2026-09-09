"use client";

import React from "react";
import { TemperatureProvider } from "@/context/TemperatureContext";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ConditionsSection from "@/components/ConditionsSection";
import RoomsStorySection from "@/components/RoomsStorySection";
import DiagnosticsSection from "@/components/DiagnosticsSection";
import ServicesSection from "@/components/ServicesSection";
import TechnicianSection from "@/components/TechnicianSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import TemperatureBadge from "@/components/TemperatureBadge";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  return (
    <TemperatureProvider>
      <div className="relative min-h-screen flex flex-col bg-cream text-ink atmospheric-noise selection:bg-terracotta selection:text-white">
        {/* Persistent Navigation */}
        <Navigation />

        <main className="flex-1 w-full">
          {/* 1. Hero: "HOW SHOULD HOME FEEL?" */}
          <HeroSection />

          {/* 2. Interactive Environmental Conditions: "TOO HOT?" */}
          <ConditionsSection />

          {/* 3. Rooms as Interface: "THE ROOMS TELL THE STORY" */}
          <RoomsStorySection />

          {/* 4. Honest Practical Troubleshooting: "WHEN IT STOPS WORKING" */}
          <DiagnosticsSection />

          {/* 5. Giant Service Environments: "COOL. WARM. BREATHE." */}
          <ServicesSection />

          {/* Human Profile: Evan Brooks */}
          <TechnicianSection />

          {/* 6. Final CTA: "FEELS BETTER IN HERE." */}
          <FinalCtaSection />
        </main>

        {/* Muted Slate Footer */}
        <Footer />

        {/* Ambient Temperature Memory Thread (72°) */}
        <TemperatureBadge />

        {/* Tactile Book a Visit Dialog */}
        <BookingModal />
      </div>
    </TemperatureProvider>
  );
}
