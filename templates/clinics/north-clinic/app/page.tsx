"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatBringsYouIn from "@/components/WhatBringsYouIn";
import CareWithoutMenu from "@/components/CareWithoutMenu";
import TheVisit from "@/components/TheVisit";
import ThePeople from "@/components/ThePeople";
import EveningCta from "@/components/EveningCta";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleOpenBooking = () => setBookingOpen(true);
  const handleCloseBooking = () => setBookingOpen(false);

  return (
    <main className="relative min-h-screen bg-ivory text-ink flex flex-col selection:bg-sage selection:text-white">
      {/* 1. Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* 2. Hero: "YOU CAN SLOW DOWN HERE." */}
      <Hero onOpenBooking={handleOpenBooking} />

      {/* 3. Section: "WHAT BRINGS YOU IN?" */}
      <WhatBringsYouIn />

      {/* 4. Section: CARE WITHOUT THE MENU */}
      <CareWithoutMenu />

      {/* 5. Section: THE VISIT */}
      <TheVisit />

      {/* 6. Section: THE PEOPLE */}
      <ThePeople />

      {/* 7. Final Action: "COME AS YOU ARE." */}
      <EveningCta onOpenBooking={handleOpenBooking} />

      {/* 8. Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Booking Dialog */}
      <BookingModal isOpen={bookingOpen} onClose={handleCloseBooking} />
    </main>
  );
}
