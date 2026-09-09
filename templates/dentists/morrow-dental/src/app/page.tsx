"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import TreatmentsSection from "@/components/TreatmentsSection";
import ConsultationSection from "@/components/ConsultationSection";
import DetailsSection from "@/components/DetailsSection";
import DoctorSection from "@/components/DoctorSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-porcelain text-ink selection:bg-blush selection:text-ink">
      {/* Editorial Navbar */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Page Flow (gently shifts downward when mobile menu unfolds) */}
      <main
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? "translate-y-3 sm:translate-y-0" : "translate-y-0"
        }`}
      >
        {/* 1. Hero — The Face */}
        <HeroSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 2. Section — “Not Every Smile Needs Changing” */}
        <PhilosophySection />

        {/* 3. Section — Treatments as Portrait Notes */}
        <TreatmentsSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 4. Section — “The Consultation” */}
        <ConsultationSection />

        {/* 5. Section — The Details */}
        <DetailsSection />

        {/* 6. The Doctor */}
        <DoctorSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 7. Final CTA — “Come As You Are” */}
        <FinalCtaSection onOpenBooking={() => setIsBookingOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Visit Consultation Dialog */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
