"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clinicData, navbarContent } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  onOpenBooking,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = navbarContent.navLinks;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          isScrolled
            ? "bg-porcelain/95 border-b border-stone/30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            : "bg-porcelain/60 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              className="text-lg tracking-widest font-sans font-semibold text-ink hover:opacity-80 transition-opacity"
              aria-label="Morrow Dental Home"
            >
              {clinicData.shortName}
            </Link>
          </div>

          {/* Center: Editorial Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest text-ink/80 hover:text-ink transition-colors relative py-1 hover:border-b hover:border-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Primary Action (Desktop) */}
          <div className="flex-1 flex items-center justify-end">
            <button
              onClick={onOpenBooking}
              className="hidden md:inline-flex text-xs uppercase tracking-widest text-ink hover:text-ink/70 transition-colors py-2 px-1 border-b border-ink/40 hover:border-ink cursor-pointer font-medium"
            >
              {navbarContent.bookButton}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden text-xs uppercase tracking-widest text-ink py-2 px-1 cursor-pointer flex items-center gap-1.5"
            >
              <span className="font-mono text-[11px]">
                {isMobileMenuOpen ? navbarContent.mobileClose : navbarContent.mobileMenu}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel (soft porcelain panel unfolds from top) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
              className="md:hidden overflow-hidden bg-porcelain border-b border-stone/40 px-6 pt-4 pb-8"
            >
              <nav className="flex flex-col space-y-6 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-base font-serif tracking-wide text-ink hover:text-ink/60 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-stone/30 flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenBooking();
                    }}
                    className="text-left text-xs uppercase tracking-widest text-ink font-semibold py-2"
                  >
                    {navbarContent.bookButtonMobile}
                  </button>
                  <p className="text-xs text-ink/50 font-mono">
                    {clinicData.phone} · {clinicData.address}
                  </p>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
