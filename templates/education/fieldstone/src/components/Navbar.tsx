"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { navbarContent } from "@/data/content";

interface NavbarProps {
  onOpenVisitModal: () => void;
}

export default function Navbar({ onOpenVisitModal }: NavbarProps) {
  const [navTheme, setNavTheme] = useState<{
    bg: string;
    text: string;
    border: string;
  }>({
    bg: "#F5F1E8",
    text: "#20231F",
    border: "rgba(32, 35, 31, 0.1)",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      const hero = document.getElementById("hero");
      const interests = document.getElementById("interests");
      const day = document.getElementById("day");
      const campus = document.getElementById("campus");
      const philosophy = document.getElementById("philosophy");
      const admissions = document.getElementById("admissions");
      const finalMoment = document.getElementById("final-moment");

      const admissionsTop = admissions?.offsetTop || 0;
      const philosophyTop = philosophy?.offsetTop || 0;
      const campusTop = campus?.offsetTop || 0;
      const dayTop = day?.offsetTop || 0;
      const interestsTop = interests?.offsetTop || 0;
      const finalTop = finalMoment?.offsetTop || 0;

      if (finalTop && scrollY >= finalTop) {
        setNavTheme({
          bg: "#20231F",
          text: "#FFFDF8",
          border: "rgba(255, 253, 248, 0.15)",
        });
      } else if (admissionsTop && scrollY >= admissionsTop) {
        setNavTheme({
          bg: "#D76C56",
          text: "#FFFDF8",
          border: "rgba(255, 253, 248, 0.2)",
        });
      } else if (philosophyTop && scrollY >= philosophyTop) {
        setNavTheme({
          bg: "#20231F",
          text: "#FFFDF8",
          border: "rgba(255, 253, 248, 0.15)",
        });
      } else if (campusTop && scrollY >= campusTop) {
        setNavTheme({
          bg: "#F5F1E8",
          text: "#20231F",
          border: "rgba(32, 35, 31, 0.1)",
        });
      } else if (dayTop && scrollY >= dayTop) {
        setNavTheme({
          bg: "#EFE8DC",
          text: "#20231F",
          border: "rgba(32, 35, 31, 0.12)",
        });
      } else if (interestsTop && scrollY >= interestsTop) {
        setNavTheme({
          bg: "#FFFDF8",
          text: "#20231F",
          border: "rgba(32, 35, 31, 0.08)",
        });
      } else {
        setNavTheme({
          bg: "#F5F1E8",
          text: "#20231F",
          border: "rgba(32, 35, 31, 0.1)",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 border-b"
        style={{
          backgroundColor: navTheme.bg,
          color: navTheme.text,
          borderColor: navTheme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between">
          {/* Left: Brand */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 text-left group cursor-pointer"
            aria-label="Fieldstone School Home"
          >
            <span className="font-serif-title font-bold text-xl sm:text-2xl tracking-tight">
              {navbarContent.brand}
            </span>
            <span
              className="hidden sm:inline-block text-[11px] uppercase tracking-widest font-semibold opacity-60 ml-1 border-l pl-3"
              style={{ borderColor: navTheme.border }}
            >
              {navbarContent.subBrand}
            </span>
          </button>

          {/* Center: Desktop Clean Nav */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide"
          >
            {navbarContent.links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.targetId)}
                className="hover:opacity-60 transition-opacity cursor-pointer py-1"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: CTA & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenVisitModal}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer border"
              style={{
                borderColor: navTheme.text,
                color: navTheme.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navTheme.text;
                e.currentTarget.style.color = navTheme.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = navTheme.text;
              }}
            >
              <span>{navbarContent.cta}</span>
              <span aria-hidden="true">→</span>
            </button>

            {/* Mobile Menu Toggle: FIELDSTONE + MENU */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-2 text-xs uppercase font-bold tracking-widest px-3 py-2 border rounded cursor-pointer"
              style={{ borderColor: navTheme.border }}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Menu"
            >
              <span>{mobileMenuOpen ? navbarContent.mobileToggleClose : navbarContent.mobileToggleOpen}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Unfolding Sheet of Paper */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#20231F]/40 backdrop-blur-xs md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ scaleY: 0, rotateX: -25, originY: 0 }}
              animate={{ scaleY: 1, rotateX: 0, originY: 0 }}
              exit={{ scaleY: 0, rotateX: -25, originY: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#F5F1E8] text-[#20231F] pt-24 pb-12 px-8 shadow-2xl border-b-4 border-[#E5B84C] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle paper fold lines */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_49%,rgba(32,35,31,0.06)_50%,transparent_51%)] bg-[length:100%_40px]" />

              <div className="flex flex-col gap-6 max-w-sm mx-auto">
                <div className="text-[11px] uppercase tracking-widest text-[#73866C] font-semibold border-b border-[#20231F]/10 pb-2">
                  {navbarContent.mobileMenuLabel}
                </div>

                {/* Staggered vertical link positions */}
                <div className="flex flex-col gap-5 pt-2">
                  {navbarContent.mobileLinks.map((link, i) => {
                    const colors = ["hover:text-[#4E7FA3]", "hover:text-[#E5B84C]", "hover:text-[#73866C]", "hover:text-[#D76C56]", "hover:text-[#D76C56]"];
                    const plClasses = ["pl-0", "pl-4", "pl-2", "pl-6", "pl-1"];
                    const xOffsets = [-16, 20, -12, 24, -10];
                    return (
                      <motion.button
                        key={link.number}
                        initial={{ x: xOffsets[i % xOffsets.length], opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        onClick={() => scrollTo(link.targetId)}
                        className={`text-left font-serif-title text-3xl font-bold ${colors[i % colors.length]} transition-colors cursor-pointer ${plClasses[i % plClasses.length]}`}
                      >
                        {link.number}. {link.label}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-[#20231F]/10 flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenVisitModal();
                    }}
                    className="w-full py-3.5 bg-[#20231F] text-[#FFFDF8] rounded-lg font-semibold text-sm tracking-wider uppercase text-center hover:bg-[#D76C56] transition-colors cursor-pointer"
                  >
                    {navbarContent.mobileCta}
                  </button>
                  <p className="text-xs text-[#20231F]/60 text-center font-mono">
                    {navbarContent.mobileFooter}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
