"use client";

import React, { useState, useEffect } from "react";
import { useAir } from "@/context/AirContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { navigationContent, companyInfo } from "@/data/content";

export default function Navbar() {
  const { isBookingOpen, setIsBookingOpen, setBookingService, activeTone } = useAir();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute tone background based on scroll position and active section tone
  const getNavBg = () => {
    if (activeTone === "cool") {
      return "rgba(220, 237, 241, 0.96)"; // Pale cool tone
    }
    if (activeTone === "warm") {
      return "rgba(243, 225, 205, 0.96)"; // Warm ivory tone
    }
    if (activeTone === "mist") {
      return "rgba(227, 230, 224, 0.96)"; // Mist tone
    }
    if (activeTone === "white") {
      return "rgba(251, 251, 248, 0.98)";
    }
    // Default paper tone with subtle scroll tint
    return scrollY > 60 ? "rgba(244, 241, 233, 0.98)" : "#F4F1E9";
  };

  const navLinks = navigationContent.links;

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookClick = (service = "General Visit") => {
    setMobileMenuOpen(false);
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <>
      <header
        style={{
          backgroundColor: getNavBg(),
          transition: "background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
        }}
        className="fixed top-0 left-0 right-0 z-40 h-16 sm:h-20 border-b border-[#202321]/10 flex items-center px-6 sm:px-10 lg:px-16"
      >
        <div className="w-full flex items-center justify-between">
          {/* Left: Brand */}
          <a
            href="#"
            className="flex items-baseline gap-2.5 text-[#202321] tracking-tight group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-sans">
              {navigationContent.logo}
            </span>
            <span className="hidden md:inline-block text-xs uppercase tracking-widest text-[#202321]/60 font-medium">
              {navigationContent.trade}
            </span>
          </a>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium tracking-normal text-[#202321]/80 hover:text-[#202321] transition-colors relative py-1 focus-visible:ring-2 focus-visible:ring-[#202321] rounded"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Book a Visit */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBookClick()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#202321] text-[#F4F1E9] hover:bg-[#607F87] transition-colors duration-300 rounded-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202321]"
            >
              <span>{navigationContent.bookCta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#202321] py-2 px-1 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <span>{navigationContent.mobileMenuLabel}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu: Two Large Stacked Color Fields (Warm above, Cool below) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col md:hidden"
          >
            {/* Top Field: Warm (#E5B28D) */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-1 bg-[#E5B28D] text-[#202321] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold uppercase tracking-tight font-sans">
                  {navigationContent.logo}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#202321] hover:opacity-75 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-xs uppercase tracking-widest text-[#202321]/70 font-semibold">
                  {navigationContent.mobileLocation}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavClick("#cooling")}
                    className="block text-3xl font-serif italic text-left text-[#202321] hover:translate-x-2 transition-transform"
                  >
                    Cooling
                  </button>
                  <button
                    onClick={() => handleNavClick("#heating")}
                    className="block text-3xl font-serif italic text-left text-[#202321] hover:translate-x-2 transition-transform"
                  >
                    Heating
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dividing Line Bar with Call Us Direct Link */}
            <div className="h-0.5 bg-[#202321]/20 w-full" />

            {/* Bottom Field: Cool (#BBD9DF) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-1 bg-[#BBD9DF] text-[#202321] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => handleNavClick("#indoor-air")}
                  className="block text-3xl font-serif italic text-left text-[#202321] hover:translate-x-2 transition-transform"
                >
                  Indoor Air
                </button>
                <button
                  onClick={() => handleNavClick("#the-work")}
                  className="block text-3xl font-serif italic text-left text-[#202321] hover:translate-x-2 transition-transform"
                >
                  About Our Work
                </button>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#202321]/15">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleBookClick()}
                    className="w-full py-3.5 px-6 bg-[#202321] text-[#F4F1E9] text-xs uppercase tracking-widest font-semibold text-center"
                  >
                    {navigationContent.bookCta} →
                  </button>
                  <a
                    href={companyInfo.phoneTel}
                    className="w-full py-3 px-6 border border-[#202321] text-[#202321] text-xs uppercase tracking-widest font-semibold text-center hover:bg-[#202321] hover:text-[#F4F1E9] transition-colors"
                  >
                    {navigationContent.mobileCall}
                  </a>
                </div>
                <p className="text-xs text-[#202321]/70 tracking-wide text-center">
                  {navigationContent.mobileTagline}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
