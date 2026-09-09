"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { businessInfo, navigationContent } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          scrolled
            ? "bg-[#FAFAF7]/92 backdrop-blur-md border-b border-[#A86F4F]/35 shadow-[0_4px_20px_rgba(36,37,34,0.03)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Left: Brand Name */}
          <a
            href="#"
            className="text-[13px] tracking-[0.24em] font-semibold text-[#242522] uppercase hover:text-[#A86F4F] transition-colors"
          >
            {navigationContent.brand}
          </a>

          {/* Center: Clean Architectural Nav */}
          <nav className="hidden md:flex items-center space-x-10 text-[12px] tracking-[0.2em] uppercase text-[#242522]/80 font-medium">
            {navigationContent.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#242522] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#A86F4F] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={onOpenBooking}
              className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#242522] border border-[#242522]/30 px-5 py-2.5 rounded-none hover:border-[#A86F4F] hover:bg-[#A86F4F] hover:text-[#FAFAF7] transition-all duration-300 active:scale-[0.98]"
            >
              {navigationContent.ctaButton}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[12px] tracking-[0.24em] font-medium text-[#242522] uppercase py-2 px-1 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? navigationContent.menuToggleClose : navigationContent.menuToggleOpen}
          </button>
        </div>
      </header>

      {/* Mobile Mirror-Cabinet Dropdown Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-30 bg-[#FAFAF7] border-b border-[#A86F4F]/40 shadow-2xl pt-24 pb-10 px-8 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navigationContent.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[15px] tracking-[0.2em] uppercase font-medium text-[#242522] border-b border-[#E9E7E1] pb-3"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-4 flex flex-col space-y-4">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full text-center text-[12px] tracking-[0.22em] uppercase font-semibold text-[#FAFAF7] bg-[#242522] hover:bg-[#A86F4F] py-3.5 transition-colors"
                >
                  {navigationContent.ctaButton}
                </button>
                <a
                  href={`tel:${businessInfo.phoneTel}`}
                  className="text-center text-[13px] tracking-[0.15em] text-[#242522]/70 font-mono"
                >
                  {businessInfo.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
