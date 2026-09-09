"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";

import HeroSection from "@/components/HeroSection";

import NightChangesSection from "@/components/NightChangesSection";
import MenuTonightSection from "@/components/MenuTonightSection";
import TheRoomSection from "@/components/TheRoomSection";
import TheBarSection from "@/components/TheBarSection";
import ReservationPoster from "@/components/ReservationPoster";
import FinalMomentSection from "@/components/FinalMomentSection";
import FooterSection from "@/components/FooterSection";
import MenuModal from "@/components/MenuModal";
import DrinksModal from "@/components/DrinksModal";
import FindUsModal from "@/components/FindUsModal";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrinksOpen, setIsDrinksOpen] = useState(false);
  const [isFindUsOpen, setIsFindUsOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <SmoothScroll>
      {/* Top Scroll Progress Line */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#702F35] origin-left z-[70] pointer-events-none"
      />

      <main className="relative min-h-screen w-full bg-[#171514] text-[#E9E2D4] selection:bg-[#702F35] selection:text-[#F7F2E8]">

        {/* Structural Navigation */}
        <Navigation
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenFindUs={() => setIsFindUsOpen(true)}
        />

        {/* 1. Hero — The First Table */}
        <HeroSection />

        {/* 2. The Night Changes (6:14 PM → 8:47 PM → 11:26 PM) */}
        <NightChangesSection />

        {/* 3. Menu — "TONIGHT" with Cursor-Follow Photography & Mobile Tap */}
        <MenuTonightSection onOpenFullMenu={() => setIsMenuOpen(true)} />

        {/* 4. The Room — Full Bleed & Pinned Notes */}
        <TheRoomSection />

        {/* 5. The Bar — Drifting Ingredients & Deep Wine Palette */}
        <TheBarSection onOpenDrinks={() => setIsDrinksOpen(true)} />

        {/* 6. Reservation — The Printed Poster with Animated Transformation */}
        <ReservationPoster />

        {/* 7. Final Moment — Quiet Late-Night Solitary Candle */}
        <FinalMomentSection />

        {/* 8. Footer — Almost Black & Simple */}
        <FooterSection
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenFindUs={() => setIsFindUsOpen(true)}
        />

        {/* Interactive Drawers & Overlays */}
        <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <DrinksModal
          isOpen={isDrinksOpen}
          onClose={() => setIsDrinksOpen(false)}
        />
        <FindUsModal
          isOpen={isFindUsOpen}
          onClose={() => setIsFindUsOpen(false)}
        />
      </main>
    </SmoothScroll>
  );
}

