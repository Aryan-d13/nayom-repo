"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { navigationContent } from "@/data/content";

interface NavigationProps {
  onOpenMenu: () => void;
  onOpenFindUs: () => void;
}

export default function Navigation({ onOpenMenu, onOpenFindUs }: NavigationProps) {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Keep colors responsive to dark vs light scroll regions without becoming glass
      const y = window.scrollY;
      setScrolledPastHero(y > 550);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToReservation = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("reservation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTonight = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("tonight-menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-colors duration-500">
      <nav
        aria-label="Main Navigation"
        className={`w-full px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b transition-colors duration-500 ${
          scrolledPastHero
            ? "border-[#171514]/20 bg-[#171514]/95 text-[#E9E2D4]"
            : "border-[#171514]/10 bg-[#E9E2D4]/95 text-[#171514]"
        }`}
      >
        {/* Top Left: Brand */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="tracking-[0.18em] font-sans font-bold text-sm sm:text-base uppercase hover:opacity-75 transition-opacity"
          >
            {navigationContent.brand}
          </Link>
        </div>

        {/* Top Right Desktop Nav */}
        <div className="flex items-center space-x-6 sm:space-x-8 pointer-events-auto">
          <div className="hidden md:flex items-center space-x-7 text-xs sm:text-[13px] tracking-[0.14em] font-mono uppercase">
            {navigationContent.links.map((link) => {
              if ("action" in link && link.action === "openMenu") {
                return (
                  <button
                    key={link.label}
                    onClick={onOpenMenu}
                    className="hover:text-[#702F35] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }
              if ("action" in link && link.action === "openFindUs") {
                return (
                  <button
                    key={link.label}
                    onClick={onOpenFindUs}
                    className="hover:text-[#702F35] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <button
                  key={link.label}
                  onClick={scrollToTonight}
                  className="hover:text-[#702F35] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Far Right: Solid wine-colored rectangle BOOK button */}
          <a
            href={navigationContent.bookCta.href}
            onClick={scrollToReservation}
            className="bg-[#702F35] hover:bg-[#85373e] text-[#F7F2E8] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.16em] uppercase px-4 sm:px-5 py-2 transition-all active:scale-[0.98] shadow-sm inline-block"
          >
            {navigationContent.bookCta.label}
          </a>
        </div>
      </nav>

      {/* Mobile-only horizontal strip below header */}
      <div
        className={`md:hidden pointer-events-auto w-full py-1.5 px-4 text-center text-[10px] tracking-[0.24em] font-mono uppercase border-b transition-colors duration-500 ${
          scrolledPastHero
            ? "bg-[#1f1d1b] text-[#B7AEA0] border-[#312c2a]"
            : "bg-[#ded6c5] text-[#702F35] border-[#cfc4b0]"
        }`}
      >
        {navigationContent.mobileStrip}
      </div>
    </header>
  );
}
