"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navigationContent, clinicInfo } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile door is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-colors duration-500 bg-ivory/95 ${
          scrolled ? "border-b border-sage/40" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <a
            href="#"
            className="group flex items-baseline gap-2 tracking-[0.2em] font-sans font-medium text-ink hover:text-ink/80 transition-colors text-sm uppercase"
            aria-label={`${clinicInfo.name} ${clinicInfo.fullType} Home`}
          >
            <span>{navigationContent.brand}</span>
            <span className="text-[10px] tracking-widest text-ink/50 lowercase font-normal hidden sm:inline">
              {navigationContent.badge}
            </span>
          </a>

          {/* Center: Quiet Editorial Links (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.18em] text-ink/70"
          >
            {navigationContent.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-ink transition-colors relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-sage group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ))}
          </nav>

          {/* Right: Action CTA */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={onOpenBooking}
              type="button"
              className="text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-sage transition-colors flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-4"
            >
              <span>{navigationContent.ctaText}</span>
              <span className="text-sage transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              className="text-xs uppercase tracking-[0.2em] text-ink font-medium px-2 py-1 focus-visible:outline-2 focus-visible:outline-sage cursor-pointer"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Door Panel (Clinic sliding door feel) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
            />

            {/* Pale Panel Sliding Horizontally from Left like a Wood/Paper Clinic Door */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white border-r border-dust shadow-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-dust/60">
                  <span className="tracking-[0.25em] font-medium text-ink text-sm uppercase">
                    {navigationContent.brand}
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs tracking-[0.15em] text-ink/60 uppercase hover:text-ink cursor-pointer p-2"
                    aria-label="Close Navigation Menu"
                  >
                    {navigationContent.mobileClose}
                  </button>
                </div>

                <nav className="mt-12 flex flex-col gap-8">
                  {navigationContent.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-serif text-ink hover:text-sage transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="pt-8 border-t border-dust/60 space-y-6">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full text-center py-3 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-sage transition-colors cursor-pointer"
                >
                  {navigationContent.ctaText} →
                </button>
                <div className="text-[11px] text-ink/60 font-sans space-y-1">
                  <p>{navigationContent.drawerAddress}</p>
                  <p>{navigationContent.drawerPhone}</p>
                  <p>{navigationContent.drawerHours}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
