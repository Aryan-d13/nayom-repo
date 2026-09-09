"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Phone } from "lucide-react";
import { COMPANY, navbarContent } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-[#F4F0E7] transition-all duration-300 ease-out ${
        scrolled ? "py-3 shadow-xs" : "py-6 sm:py-7"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-lg sm:text-xl font-medium tracking-tight text-[#15212A] hover:text-[#397A91] transition-colors"
          >
            {COMPANY.shortName}
          </a>
          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-[#397A91]" />
          <span className="hidden md:inline-block text-[11px] font-mono uppercase tracking-widest text-[#15212A]/50">
            {navbarContent.locationTag}
          </span>
        </div>

        {/* Center: Editorial Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-medium tracking-wider text-[#15212A]/80 uppercase"
        >
          {navbarContent.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="editorial-link py-1 hover:text-[#15212A] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-6">
          <a
            href={COMPANY.phoneRaw}
            className="text-xs font-medium tracking-wider uppercase text-[#15212A]/80 hover:text-[#397A91] transition-colors inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#397A91]" />
            <span>{navbarContent.callUsLabel}</span>
          </a>

          <button
            type="button"
            onClick={onOpenBooking}
            className="group inline-flex items-center gap-2 bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] text-xs font-medium uppercase tracking-wider px-4 py-2.5 transition-all duration-200 cursor-pointer"
          >
            <span>{navbarContent.bookButtonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex sm:hidden items-center gap-3">
          <button
            type="button"
            onClick={onOpenBooking}
            className="bg-[#15212A] text-[#F4F0E7] text-[11px] font-medium uppercase tracking-wider px-3 py-1.5"
          >
            {navbarContent.bookMobileLabel}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 text-[#15212A] hover:text-[#397A91] transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Thin Blue Line on Scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#397A91] transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Mobile Menu: opens downward like a folded piece of paper */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, transformOrigin: "top" }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden sm:hidden bg-[#F4F0E7] border-b border-[#397A91]/30 shadow-md"
          >
            <div className="px-5 py-5 space-y-4 text-sm font-medium uppercase tracking-wider text-[#15212A]">
              <div className="flex flex-col space-y-3 pb-3 border-b border-[#15212A]/10">
                {navbarContent.navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-[#397A91] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-1 flex flex-col gap-3">
                <a
                  href={COMPANY.phoneRaw}
                  className="flex items-center gap-2 text-xs text-[#15212A]/80 hover:text-[#397A91]"
                >
                  <Phone className="w-4 h-4 text-[#397A91]" />
                  <span>{navbarContent.callUsLabel}: {COMPANY.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#15212A] text-[#F4F0E7] py-2.5 text-xs font-medium uppercase tracking-wider"
                >
                  <span>{navbarContent.bookButtonLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
