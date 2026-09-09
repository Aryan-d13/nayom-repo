"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { navigationContent, businessInfo } from "@/data/content";

interface NavigationProps {
  onOpenQuote: (service?: string) => void;
}

export default function Navigation({ onOpenQuote }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = navigationContent.links;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#F5F1E8] text-[#202321] border-b border-[#D4D0C7]/80 py-3 shadow-sm"
            : "bg-gradient-to-b from-[#111311]/80 via-[#111311]/40 to-transparent text-[#F5F1E8] py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Left */}
          <a
            href="#"
            className="group flex flex-col items-start leading-none tracking-tight focus:outline-none"
          >
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight">
              {navigationContent.brand}
            </span>
            <span
              className={`text-[9px] font-mono tracking-[0.25em] uppercase transition-colors duration-300 ${
                scrolled ? "text-[#53645A]" : "text-[#D4D0C7]/80"
              }`}
            >
              {navigationContent.subBrand}
            </span>
          </a>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center space-x-10 text-xs font-mono tracking-widest uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors duration-200 hover:text-[#A85F45] ${
                  scrolled ? "text-[#202321]/80" : "text-[#F5F1E8]/90"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTA / Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onOpenQuote("Garage Door Replacement")}
              className={`hidden sm:inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase px-5 py-2.5 transition-all duration-200 ${
                scrolled
                  ? "bg-[#202321] text-[#F5F1E8] hover:bg-[#A85F45]"
                  : "border border-[#F5F1E8]/60 text-[#F5F1E8] hover:bg-[#F5F1E8] hover:text-[#111311]"
              }`}
            >
              {navigationContent.cta}
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase px-3 py-2 border border-current transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? navigationContent.menuClose : navigationContent.menuOpen}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Garage Door Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1], // physical garage door mechanical drop curve
            }}
            className="fixed inset-x-0 top-0 z-50 bg-[#202321] text-[#F5F1E8] border-b-4 border-[#A85F45] shadow-2xl pt-20 pb-10 px-6 flex flex-col md:hidden"
          >
            {/* Garage Door horizontal panel seams (subtle physical details) */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#111311]/80" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/10" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/10" />

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <p className="font-serif text-2xl">{navigationContent.brand}</p>
                <p className="text-[10px] font-mono tracking-[0.2em] text-[#D4D0C7]/70 uppercase">
                  {navigationContent.mobileLocation}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/70 hover:text-white"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-5 text-sm font-mono tracking-widest uppercase">
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-white/5 hover:text-[#A85F45] transition-colors"
                >
                  <span>
                    <span className="text-[#A85F45] mr-3 text-xs">0{idx + 1}</span>
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote("Garage Door Replacement");
                }}
                className="w-full py-3 bg-[#A85F45] text-white text-xs font-mono tracking-widest uppercase text-center hover:bg-[#A85F45]/90 transition-colors"
              >
                {navigationContent.cta} →
              </button>
              <a
                href={`tel:${businessInfo.phoneTel}`}
                className="text-center text-xs font-mono text-[#D4D0C7]/80 hover:text-white py-2"
              >
                {navigationContent.directLabel} {businessInfo.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
