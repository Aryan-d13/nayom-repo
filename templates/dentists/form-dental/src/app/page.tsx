"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BetterVisitSection from "@/components/BetterVisitSection";
import TreatmentsSection from "@/components/TreatmentsSection";
import TheRoomSection from "@/components/TheRoomSection";
import TeamSection from "@/components/TeamSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div className="relative min-h-screen bg-bone text-ink selection:bg-clay/20 selection:text-ink">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-ink text-bone text-xs uppercase tracking-widest font-medium"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <Navbar onBookClick={openBooking} />

      {/* Main Content Sections */}
      <main id="main-content" className="focus:outline-none">
        {/* 1. Hero: Take Your Time */}
        <Hero onBookClick={openBooking} />

        {/* 2. Section: A Better Dental Visit */}
        <BetterVisitSection />

        {/* 3. Section: Treatments - Start With What You Need */}
        <TreatmentsSection onBookClick={openBooking} />

        {/* 4. Section: The Room - A Place That Feels Like A Place */}
        <TheRoomSection />

        {/* 5. Section: Team - People First */}
        <TeamSection />

        {/* Climax CTA: Come See Us */}
        <FinalCtaSection onBookClick={openBooking} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Accessible Booking Conversation Dialog */}
      <BookingModal isOpen={bookingOpen} onClose={closeBooking} />
    </div>
  );
}

