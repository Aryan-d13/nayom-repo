"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/data/content";
import { ArrowRight, Menu, X, Phone } from "lucide-react";

interface NavbarProps {
  onOpenInquiry: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          scrolled
            ? "bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#D8D2C6]/50 shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#"
            className="group flex flex-col items-start focus:outline-hidden focus:ring-2 focus:ring-terracotta/40 rounded-sm"
          >
            <span className="font-sans font-semibold tracking-[0.2em] text-sm md:text-base text-ink transition-colors group-hover:text-terracotta">
              {BRAND.name}
            </span>
            <span className="font-sans text-[10px] tracking-wider text-ink/60 uppercase">
              {BRAND.address}
            </span>
          </a>

          {/* Desktop Center Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-10"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-xs tracking-[0.18em] text-ink/70 hover:text-ink transition-colors relative py-1 focus:outline-hidden focus:ring-1 focus:ring-terracotta"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="font-sans text-xs tracking-wider text-ink/60 hover:text-ink flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3 text-terracotta" />
              <span>{BRAND.phone}</span>
            </a>
            <button
              onClick={onOpenInquiry}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ink/20 hover:border-ink bg-transparent hover:bg-ink hover:text-chalk text-xs tracking-[0.16em] uppercase text-ink transition-all duration-300 rounded-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-terracotta"
            >
              <span>{BRAND.primaryCTA}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink hover:text-terracotta focus:outline-hidden focus:ring-1 focus:ring-terracotta rounded-sm"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Tracing Paper Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-20 z-30 tracing-paper border-b border-[#D8D2C6] px-8 py-10 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx, duration: 0.3 }}
                  className="font-serif text-3xl text-ink tracking-tight hover:text-terracotta transition-colors py-1 border-b border-stone/30"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="pt-4 flex flex-col gap-4"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInquiry();
                  }}
                  className="w-full py-3.5 bg-ink text-chalk text-xs tracking-[0.2em] uppercase font-sans flex items-center justify-center gap-2 hover:bg-terracotta transition-colors"
                >
                  <span>{BRAND.primaryCTA}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="text-center font-sans text-xs tracking-widest text-ink/70 py-2"
                >
                  {BRAND.phone} • {BRAND.address}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
