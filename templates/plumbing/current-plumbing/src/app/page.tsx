"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FollowTheWater from "@/components/FollowTheWater";
import TheDrip from "@/components/TheDrip";
import SomethingsOff from "@/components/SomethingsOff";
import TheWork from "@/components/TheWork";
import CommonCalls from "@/components/CommonCalls";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Plumbing Repairs");

  const handleOpenBooking = (service?: string) => {
    if (service) {
      setSelectedService(service);
    }
    setBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
  };

  return (
    <main className="relative min-h-screen bg-[#F3EFE7] text-[#17252A] selection:bg-[#DDF0EC] selection:text-[#17252A]">
      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Hero — “EVERYTHING HAS A WAY IN.” */}
      <Hero onOpenBooking={() => handleOpenBooking("Plumbing Repairs")} />

      {/* Section — “FOLLOW THE WATER” */}
      <FollowTheWater onOpenBooking={handleOpenBooking} />

      {/* Section — THE DRIP */}
      <TheDrip onOpenBooking={handleOpenBooking} />

      {/* Section — “SOMETHING'S OFF” */}
      <SomethingsOff onOpenBooking={handleOpenBooking} />

      {/* Section — THE WORK */}
      <TheWork />

      {/* Section — COMMON CALLS */}
      <CommonCalls onOpenBooking={handleOpenBooking} />

      {/* Final CTA — “KEEP THINGS MOVING.” */}
      <FinalCta onOpenBooking={() => handleOpenBooking("Plumbing Repairs")} />

      {/* Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Global Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={handleCloseBooking}
        defaultService={selectedService}
      />
    </main>
  );
}
