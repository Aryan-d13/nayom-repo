"use client";

import React from "react";
import { AirProvider } from "@/context/AirContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TemperatureRoomSection from "@/components/TemperatureRoomSection";
import HouseWeatherSection from "@/components/HouseWeatherSection";
import SymptomsSection from "@/components/SymptomsSection";
import TechnicianLoupeSection from "@/components/TechnicianLoupeSection";
import ServiceAtmospheresSection from "@/components/ServiceAtmospheresSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  return (
    <AirProvider>
      <div className="relative min-h-screen bg-[#F4F1E9] text-[#202321] selection:bg-[#202321] selection:text-[#F4F1E9]">
        {/* Fixed Navigation with Dynamic Temperature Shifting Tone */}
        <Navbar />

        <main className="w-full">
          {/* 1. Hero: You Can Feel It (Particles & Mask Reveal) */}
          <HeroSection />

          {/* 2. Signature Interaction: Watch The Room Change (Vertical Cursor Control) */}
          <TemperatureRoomSection />

          {/* 3. Architectural Cutaway: The House Has Different Weather (Air Ribbon Flow) */}
          <HouseWeatherSection />

          {/* 4. The Symptoms: When Something's Off (Temperature Shadows) */}
          <SymptomsSection />

          {/* 5. The Work: Good Service Should Feel Like a Relief (Photographer Loupe) */}
          <TechnicianLoupeSection />

          {/* 6. Service Atmospheres: COOL / WARM / BREATHE (Stationary Typography) */}
          <ServiceAtmospheresSection />

          {/* 7. Final CTA: Right Here (Dusk Settling into Peaceful Stillness) */}
          <FinalCtaSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Booking Modal */}
        <BookingModal />
      </div>
    </AirProvider>
  );
}
