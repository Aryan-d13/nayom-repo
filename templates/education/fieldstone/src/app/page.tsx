"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InterestsSection from "@/components/InterestsSection";
import DaySection from "@/components/DaySection";
import CampusSection from "@/components/CampusSection";
import PhilosophySection from "@/components/PhilosophySection";
import AdmissionsSection from "@/components/AdmissionsSection";
import FinalMoment from "@/components/FinalMoment";
import Footer from "@/components/Footer";
import VisitModal from "@/components/VisitModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultAction, setModalDefaultAction] = useState("visit");

  const handleOpenVisitModal = (action = "visit") => {
    setModalDefaultAction(action);
    setIsModalOpen(true);
  };

  const handleCloseVisitModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#20231F] selection:bg-[#E5B84C]/40">
      {/* Dynamic Section-Reactive Navigation */}
      <Navbar onOpenVisitModal={() => handleOpenVisitModal("visit")} />

      {/* 1. Hero — COME CURIOUS. */}
      <HeroSection onOpenVisitModal={() => handleOpenVisitModal("visit")} />

      {/* 2. WHAT ARE YOU INTO? */}
      <InterestsSection />

      {/* 3. A DAY AT FIELDSTONE */}
      <DaySection />

      {/* 4. THE CAMPUS */}
      <CampusSection />

      {/* 5. WHO ARE YOU BECOMING? */}
      <PhilosophySection />

      {/* ADMISSIONS — COME SEE FOR YOURSELF */}
      <AdmissionsSection
        onSelectAction={(actionId) => handleOpenVisitModal(actionId)}
      />

      {/* FINAL VISUAL MOMENT — SEE YOU TOMORROW. */}
      <FinalMoment />

      {/* FOOTER */}
      <Footer onOpenVisitModal={() => handleOpenVisitModal("visit")} />

      {/* Interactive Visit & Inquiry Dialog */}
      <VisitModal
        isOpen={isModalOpen}
        onClose={handleCloseVisitModal}
        defaultAction={modalDefaultAction}
      />
    </main>
  );
}
