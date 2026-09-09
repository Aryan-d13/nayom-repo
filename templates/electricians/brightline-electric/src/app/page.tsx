"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DiagnosticSection from "@/components/DiagnosticSection";
import RoomServices from "@/components/RoomServices";
import BrandPhilosophy from "@/components/BrandPhilosophy";
import ProjectCollage from "@/components/ProjectCollage";
import TrustSection from "@/components/TrustSection";
import FinalLightsOn from "@/components/FinalLightsOn";
import Footer from "@/components/Footer";
import BookingDrawer from "@/components/BookingDrawer";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("Diagnostic & Troubleshooting");

  const handleOpenBooking = () => {
    setSelectedService("General Residential Electrical");
    setBookingOpen(true);
  };

  const handleOpenBookingWithService = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#11110F] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#BDF45B] selection:text-[#11110F]">
      {/* 4. Minimal Fixed Navbar with Ivory scroll collapse */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Sections following the Darkness -> Light -> Darkness -> Light rhythm */}
      <main className="flex-grow">
        {/* 5. HERO: "LIGHT CHANGES EVERYTHING" / "MAKE YOUR HOME FEEL RIGHT." (Darkness) */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* 6. "WHAT'S NOT WORKING?" (Warm Ivory) */}
        <DiagnosticSection onOpenBookingWithService={handleOpenBookingWithService} />

        {/* 7. SERVICES AS A "ROOM" (Dark Charcoal) */}
        <RoomServices onOpenBookingWithService={handleOpenBookingWithService} />

        {/* 8. "WE MAKE THE DETAILS DISAPPEAR" (Dark Charcoal Parallax) */}
        <BrandPhilosophy />

        {/* 9. "SMALL PROJECTS, BIG DIFFERENCE" (Warm Ivory) */}
        <ProjectCollage />

        {/* 10. "JUST CALL US" (Warm Ivory Trust) */}
        <TrustSection onOpenBooking={handleOpenBooking} />

        {/* 11. FINAL VISUAL: "LIGHTS OUT / LIGHTS ON" (Dark to Fully Illuminated) */}
        <FinalLightsOn onOpenBooking={handleOpenBooking} />
      </main>

      {/* 12. Minimal Dark Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Interactive Booking Drawer */}
      <BookingDrawer
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedService={selectedService}
      />
    </div>
  );
}
