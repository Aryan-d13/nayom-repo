"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StyleSelectorSection from "@/components/StyleSelectorSection";
import OpenCloseSection from "@/components/OpenCloseSection";
import RepairSection from "@/components/RepairSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Garage Door Replacement");
  const [modalNote, setModalNote] = useState("");

  const handleOpenQuote = (service = "Garage Door Replacement", note = "") => {
    setSelectedService(service);
    setModalNote(note);
    setModalOpen(true);
  };

  const handleOpenRepair = (issue = "Won't open.") => {
    setSelectedService("Garage Door Repair");
    setModalNote(`Issue reported: ${issue}`);
    setModalOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#F5F1E8] text-[#202321] flex flex-col">
      {/* Top Minimal Navigation */}
      <Navigation onOpenQuote={handleOpenQuote} />

      {/* 1. Hero — “COME HOME” */}
      <HeroSection onOpenQuote={handleOpenQuote} />

      {/* 2. Section — “WHICH ONE?” */}
      <StyleSelectorSection onOpenQuote={handleOpenQuote} />

      {/* 3. Section — THE OPEN/CLOSE MOMENT */}
      <OpenCloseSection />

      {/* 4. Repair Section — “SOMETHING'S WRONG” */}
      <RepairSection onOpenRepair={handleOpenRepair} />

      {/* 5. Section — THE DOOR AS ARCHITECTURE */}
      <ArchitectureSection />

      {/* 6. Final CTA — “SEE YOU HOME” */}
      <FinalCtaSection onOpenQuote={handleOpenQuote} />

      {/* Footer */}
      <Footer onOpenQuote={handleOpenQuote} />

      {/* Interactive Quote & Repair Modal */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService={selectedService}
        defaultNote={modalNote}
      />
    </main>
  );
}
