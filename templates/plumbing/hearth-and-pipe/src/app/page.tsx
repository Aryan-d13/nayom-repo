"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoticeSection from "@/components/NoticeSection";
import InsideHomeSection from "@/components/InsideHomeSection";
import TheFixSection from "@/components/TheFixSection";
import WaterHeaterSection from "@/components/WaterHeaterSection";
import PeopleSection from "@/components/PeopleSection";
import BackToNormalSection from "@/components/BackToNormalSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#242522] selection:bg-[#A8C7C8]/40 selection:text-[#242522]">
      {/* Architectural Navigation */}
      <Navbar onOpenBooking={openBooking} />

      {/* Hero — “Good Morning.” */}
      <Hero onOpenBooking={openBooking} />

      {/* Section — The Things You Notice */}
      <NoticeSection onOpenBooking={openBooking} />

      {/* Section — Inside The Home */}
      <InsideHomeSection />

      {/* Section — The Fix */}
      <TheFixSection onOpenBooking={openBooking} />

      {/* Section — Water Heater Spotlight */}
      <WaterHeaterSection />

      {/* Section — People, Not Plumbing */}
      <PeopleSection />

      {/* Final CTA — “Back To Normal” */}
      <BackToNormalSection onOpenBooking={openBooking} />

      {/* Footer */}
      <Footer onOpenBooking={openBooking} />

      {/* Interactive Booking Drawer / Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
    </main>
  );
}
