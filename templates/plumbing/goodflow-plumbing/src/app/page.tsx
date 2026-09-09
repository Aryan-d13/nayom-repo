"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SmallProblems } from "@/components/SmallProblems";
import { InteractiveHouse } from "@/components/InteractiveHouse";
import { LeakDetection } from "@/components/LeakDetection";
import { EmergencyStrip } from "@/components/EmergencyStrip";
import { DialogueProcess } from "@/components/DialogueProcess";
import { ProjectCollage } from "@/components/ProjectCollage";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined
  );

  const handleOpenBooking = (serviceName?: string) => {
    setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedService(undefined);
  };

  return (
    <div className="relative min-h-screen bg-[#F4F0E7] text-[#15212A] flex flex-col selection:bg-[#D8E9EA] selection:text-[#15212A]">
      {/* 3. Navigation with scroll compression, thin blue line, folded paper mobile menu */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-grow">
        {/* 4. Hero: "Water should just work." with organic media window & drawing flow line */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 5. Section: "Most problems start small." with pale blue wash & soft image replacement */}
        <SmallProblems onOpenBooking={handleOpenBooking} />

        {/* 6. Section: The House as an Interactive Map (Signature Feature) */}
        <InteractiveHouse onOpenBooking={handleOpenBooking} />

        {/* 7. Section: "We'll find it." (Leak detection tracer circle animation) */}
        <LeakDetection onOpenBooking={handleOpenBooking} />

        {/* 8. Emergency Strip: Full-width calm red break, (503) 555-0139 & blinking dot */}
        <EmergencyStrip />

        {/* 9. Section: "From call to done" (Conversational dialogue sequence on ink background) */}
        <DialogueProcess />

        {/* 10. Small Projects / Real Homes: Compact asymmetric 4-image editorial collage */}
        <ProjectCollage />

        {/* 11. Final CTA: "Fix the problem. Get back to your day." Flow line closes loop */}
        <FinalCta onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* 12. Footer: Quiet cream editorial footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Interactive Booking Drawer / Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        defaultService={selectedService}
      />
    </div>
  );
}
