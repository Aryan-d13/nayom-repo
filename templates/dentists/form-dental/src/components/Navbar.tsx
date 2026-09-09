"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { clinicInfo, navLinks, navbarContent } from "@/data/content";

interface NavbarProps {
  onBookClick: () => void;
}

export default function Navbar({ onBookClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-bone/95 border-b border-stone/30 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent py-6 sm:py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Brand */}
          <a
            href="#"
            className="text-lg font-semibold tracking-widest text-ink hover:opacity-80 transition-opacity focus:outline-none focus:ring-1 focus:ring-ink"
            aria-label="Form Dental Chicago - Return to top"
          >
            {clinicInfo.shortName}
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-10"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest text-ink/70 hover:text-ink transition-colors focus:outline-none focus:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onBookClick}
              className="text-xs uppercase tracking-widest font-medium text-ink border-b border-ink/40 pb-0.5 hover:border-ink hover:text-clay transition-colors focus:outline-none focus:border-clay"
            >
              {clinicInfo.primaryCta.toUpperCase()}
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-label="Open navigation menu"
            className="md:hidden p-2 -mr-2 text-ink hover:text-clay transition-colors focus:outline-none"
          >
            <span className="text-xs font-medium uppercase tracking-widest mr-1.5 align-middle">
              {navbarContent.mobileMenuLabel}
            </span>
            <Menu className="w-4 h-4 inline align-middle" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer: Simple full-height bone panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-bone flex flex-col justify-between p-8 md:hidden text-ink"
          >
            {/* Header in Drawer */}
            <div className="flex items-center justify-between border-b border-stone/30 pb-6">
              <span className="text-lg font-semibold tracking-widest text-ink">
                {clinicInfo.shortName}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 -mr-2 text-ink hover:text-clay transition-colors focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links: Large and spaced generously */}
            <nav className="flex flex-col space-y-8 py-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl text-ink hover:text-clay transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="text-left font-serif text-3xl text-clay underline underline-offset-8 transition-colors pt-2"
              >
                {clinicInfo.primaryCta}
              </button>
            </nav>

            {/* Footer in Drawer */}
            <div className="border-t border-stone/30 pt-6 space-y-2 text-xs text-ink-muted">
              <p className="font-medium text-ink">{clinicInfo.address}</p>
              <p>{clinicInfo.hours}</p>
              <p>
                <a
                  href={`tel:${clinicInfo.phoneRaw}`}
                  className="text-ink underline hover:text-clay transition-colors"
                >
                  {clinicInfo.phone}
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
