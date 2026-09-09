"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navigationContent } from "@/data/content";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -40;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#090A0F]/85 backdrop-blur-md border-b border-white/[0.04] py-4"
            : "bg-transparent py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Top Left: ARYAN SHARMA */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group text-left focus:outline-none"
            data-thought="origin"
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#E7E6DF] group-hover:text-white transition-colors duration-300">
              {navigationContent.brand}
            </span>
          </button>

          {/* Desktop Top Right Links & Pulse Indicator */}
          <div className="hidden md:flex items-center space-x-10">
            <nav className="flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-mono text-[#878993]">
              {navigationContent.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="hover:text-[#E7E6DF] transition-colors duration-200 focus:outline-none"
                  data-thought={link.id === "work" ? "making" : link.id === "thinking" ? "ideas" : link.id === "about" ? "who is this?" : undefined}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Currently Online Indicator */}
            <div
              className="flex items-center space-x-2.5 pl-4 border-l border-white/[0.08]"
              data-thought="3 AM active"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8096C7] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8096C7] shadow-[0_0_8px_rgba(128,150,199,0.8)]" />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-[#878993] lowercase select-none">
                {navigationContent.statusText}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <div className="flex items-center space-x-1.5 mr-2">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8096C7]" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#E7E6DF] hover:text-white transition-colors"
            >
              <div className="w-5 flex flex-col items-end space-y-1">
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "w-5 translate-y-1.5 rotate-45" : "w-5"
                  }`}
                />
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "w-3"
                  }`}
                />
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "w-5 -translate-y-1.5 -rotate-45" : "w-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu: tactile paper sheet pull-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "-100%", opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 right-0 z-40 bg-[#101525] border-b border-[#8096C7]/20 shadow-2xl px-6 pt-24 pb-8 md:hidden rounded-b-2xl"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#878993]">
                    {navigationContent.indexLabel}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#8096C7] animate-pulse" />
                    <span className="font-mono text-[11px] text-[#878993] lowercase">
                      {navigationContent.statusText}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  {navigationContent.links.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left font-mono text-sm tracking-[0.16em] text-[#E7E6DF] hover:text-[#8096C7] py-2 transition-colors duration-200"
                    >
                      {item.mobileLabel}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-[11px] font-mono text-[#878993]">
                  <span>{navigationContent.brand}</span>
                  <span>{navigationContent.subtitle}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
