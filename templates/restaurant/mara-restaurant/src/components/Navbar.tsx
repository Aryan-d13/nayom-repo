"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLenis } from "@/components/SmoothScroll";
import { navigationContent } from "@/data/content";

interface NavbarProps {
  onOpenReservation?: () => void;
  onOpenMenu?: () => void;
}

export default function Navbar({ onOpenReservation, onOpenMenu }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    scrollTo(`#${id}`, -70);
  };

  return (
    <>
      {/* Top Pre-header note */}
      <header className="w-full border-b border-[#DDD1BB] bg-[#F2EADB]/90 backdrop-blur-xs relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between text-xs tracking-widest text-[#68655E] uppercase">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#687052] animate-pulse" />
            <span>{navigationContent.serviceNote}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>{navigationContent.locationNote}</span>
            <span className="text-[#C75037] font-medium font-serif italic normal-case text-sm">
              {navigationContent.walkInNote}
            </span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Subtitle */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0, 0);
            }}
            className="group flex flex-col items-start leading-none tracking-tight text-[#20201D] cursor-pointer"
          >
            <span className="font-serif text-3xl md:text-4xl tracking-tight font-bold group-hover:text-[#C75037] transition-colors">
              {navigationContent.brand}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#68655E] mt-1">
              {navigationContent.subtitle}
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wider font-medium text-[#20201D]">
            {navigationContent.links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="hover:text-[#C75037] transition-colors py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest border border-[#20201D] hover:bg-[#20201D] hover:text-[#FFFDF8] transition-all cursor-pointer rounded-xs"
              >
                <span>{navigationContent.fullMenuBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenReservation ? onOpenReservation : () => scrollToSection("reservation-section")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#C75037] text-[#FFFDF8] hover:bg-[#A93E27] shadow-xs hover:shadow-md transition-all cursor-pointer rounded-xs"
            >
              <span>{navigationContent.bookTableBtn}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 text-[#20201D] hover:text-[#C75037] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Sticky Navigation Bar when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-[#FAF6EE]/95 border border-[#DDD1BB] backdrop-blur-md shadow-lg rounded-full px-5 py-2.5 flex items-center gap-6 max-w-xl w-full justify-between">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(0, 0);
                }}
                className="font-serif text-2xl font-bold tracking-tight text-[#20201D] cursor-pointer"
              >
                {navigationContent.brand}
              </a>

              <div className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-[#20201D]">
                {navigationContent.links.slice(0, 3).map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-[#C75037] transition-colors cursor-pointer"
                  >
                    {link.shortLabel}
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenReservation ? onOpenReservation : () => scrollToSection("reservation-section")}
                className="px-4 py-1.5 text-xs uppercase tracking-widest font-semibold bg-[#C75037] text-[#FFFDF8] hover:bg-[#A93E27] rounded-full transition-all cursor-pointer"
              >
                {navigationContent.links.find((l) => l.id === "reservation-section")?.shortLabel || "Reserve"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Unfolding Paper Sheet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden border-b border-[#DDD1BB] bg-[#FAF6EE] overflow-hidden relative z-20 shadow-xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-left border-t border-dashed border-[#DDD1BB]">
              <div className="text-xs uppercase tracking-widest text-[#687052] font-semibold">
                {navigationContent.tableOfContents}
              </div>
              <div className="flex flex-col gap-4 font-serif text-2xl text-[#20201D]">
                {navigationContent.links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left hover:text-[#C75037] transition-colors flex items-center justify-between group"
                  >
                    <span>{link.mobileLabel}</span>
                    <span className="text-xs font-sans text-[#9B978F] group-hover:text-[#C75037]">
                      {link.mobileIndex}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-dashed border-[#DDD1BB] flex flex-col gap-3">
                {onOpenMenu && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMenu();
                    }}
                    className="w-full py-3 text-center text-xs uppercase tracking-widest font-semibold border border-[#20201D] text-[#20201D] hover:bg-[#20201D] hover:text-[#FFFDF8] transition-colors"
                  >
                    {navigationContent.openFullMenuBtn}
                  </button>
                )}
                <button
                  onClick={() => scrollToSection("reservation-section")}
                  className="w-full py-3 text-center text-xs uppercase tracking-widest font-semibold bg-[#C75037] text-[#FFFDF8] hover:bg-[#A93E27] transition-colors"
                >
                  {navigationContent.reserveNowBtn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
