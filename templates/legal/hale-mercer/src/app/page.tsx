"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FinePrintSection } from "@/components/FinePrintSection";
import { PracticeIndex } from "@/components/PracticeIndex";
import { PeopleSection } from "@/components/PeopleSection";
import { DocumentMoment } from "@/components/DocumentMoment";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { Footer } from "@/components/Footer";
import { ContactDrawer } from "@/components/ContactDrawer";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [inquiryPrefill, setInquiryPrefill] = useState("");

  const handleOpenContact = (inquiry?: string) => {
    if (inquiry) {
      setInquiryPrefill(inquiry);
    } else {
      setInquiryPrefill("");
    }
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1EEE7] text-[#171817] font-sans selection:bg-[#9C3C35] selection:text-[#FCFBF7]">
      {/* Navigation */}
      <Navbar onOpenContact={() => handleOpenContact()} />

      {/* Main Editorial Document Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero: When It Matters */}
        <HeroSection onOpenContact={() => handleOpenContact()} />

        {/* 2. Section: Read The Fine Print */}
        <FinePrintSection />

        {/* 3. Practice Areas: Start Here */}
        <PracticeIndex
          onOpenContact={(practiceName) =>
            handleOpenContact(
              practiceName ? `Inquiry regarding ${practiceName} counsel.` : ""
            )
          }
        />

        {/* 4. Section: The People (Elena Hale & Marcus Mercer) */}
        <PeopleSection onOpenContact={() => handleOpenContact()} />

        {/* 5. Document Moment: Matter No. 024 */}
        <DocumentMoment
          onOpenContact={(inquiry) =>
            handleOpenContact(
              inquiry
                ? `Regarding: "${inquiry}" — seeking initial legal analysis.`
                : ""
            )
          }
        />

        {/* 6. Final CTA: Start With A Conversation */}
        <FinalCtaSection onOpenContact={() => handleOpenContact()} />
      </main>

      {/* 7. Quiet Editorial Footer */}
      <Footer onOpenContact={() => handleOpenContact()} />

      {/* Confidential Consultation Dialogue Sheet */}
      <ContactDrawer
        isOpen={isContactOpen}
        onClose={handleCloseContact}
        prefillInquiry={inquiryPrefill}
      />
    </div>
  );
}
