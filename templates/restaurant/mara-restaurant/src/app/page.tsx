"use client";

import { useState } from "react";
import SmoothScroll, { useLenis } from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveMenu from "@/components/InteractiveMenu";
import FoodInMotion from "@/components/FoodInMotion";
import TheTable from "@/components/TheTable";
import ReservationPostcard from "@/components/ReservationPostcard";
import QuietFinale from "@/components/QuietFinale";
import Footer from "@/components/Footer";
import FullMenuModal from "@/components/FullMenuModal";

function HomeContent() {
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const { scrollTo } = useLenis();

  const scrollToReservation = () => {
    setIsFullMenuOpen(false);
    scrollTo("#reservation-section", -40);
  };

  const scrollToMenu = () => {
    scrollTo("#menu-section", -60);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F2EADB] text-[#20201D] selection:bg-[#C75037] selection:text-[#FFFDF8]">
      {/* Header & Navigation */}
      <Navbar
        onOpenReservation={scrollToReservation}
        onOpenMenu={() => setIsFullMenuOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <Hero
          onReserveClick={scrollToReservation}
          onMenuClick={scrollToMenu}
        />

        {/* The Signature Interactive Menu Section */}
        <InteractiveMenu
          onOpenFullMenu={() => setIsFullMenuOpen(true)}
        />

        {/* Food In Motion & Craft Section with Scroll-Linked Kinetic Marquee */}
        <FoodInMotion />

        {/* The Table & Dining Atmosphere Section with Parallax */}
        <TheTable
          onReserveClick={scrollToReservation}
        />

        {/* Reservation Postcard Section */}
        <ReservationPostcard />

        {/* Atmospheric Quiet Finale with Parallax */}
        <QuietFinale />
      </main>

      {/* Printed Paper Footer */}
      <Footer
        onOpenReservation={scrollToReservation}
        onOpenMenu={() => setIsFullMenuOpen(true)}
      />

      {/* Full Seasonal Carte Modal Overlay */}
      <FullMenuModal
        isOpen={isFullMenuOpen}
        onClose={() => setIsFullMenuOpen(false)}
        onReserveClick={scrollToReservation}
      />
    </div>
  );
}

export default function Home() {
  return (
    <SmoothScroll>
      <HomeContent />
    </SmoothScroll>
  );
}
