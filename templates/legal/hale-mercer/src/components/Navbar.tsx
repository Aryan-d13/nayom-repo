"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { FIRM_INFO, NAV_LINKS, navbarContent } from "@/data/content";

interface NavbarProps {
  onOpenContact: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["practice", "people", "matter-024"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 document-rule-b ${
          scrolled
            ? "bg-[#F1EEE7]/95 backdrop-blur-md shadow-xs py-4 border-[#171817]/15"
            : "bg-[#F1EEE7]/80 backdrop-blur-xs py-6 border-[#171817]/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            className="group flex flex-col focus:outline-none"
            aria-label="Hale & Mercer Home"
          >
            <span className="font-serif text-lg md:text-xl font-semibold tracking-wider text-[#171817] group-hover:text-[#9C3C35] transition-colors">
              {FIRM_INFO.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#555650] -mt-0.5">
              {FIRM_INFO.suffix} • NYC
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-10"
          >
            {NAV_LINKS.map((link) => {
              const sectionKey = link.href.replace("#", "");
              const isActive = activeSection === sectionKey;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="relative py-1 text-xs uppercase tracking-widest font-mono text-[#555650] hover:text-[#171817] transition-colors"
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-red-rule"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9C3C35]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 border border-[#171817] px-4 py-2 text-xs font-mono tracking-widest uppercase text-[#171817] hover:bg-[#171817] hover:text-[#FCFBF7] transition-all duration-300"
            >
              <span>{FIRM_INFO.primaryCta}</span>
              <span className="text-[#9C3C35] group-hover:text-[#FCFBF7]">→</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171817] hover:text-[#9C3C35] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Paper sheet sliding down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-x-0 top-[73px] z-30 bg-[#FCFBF7] border-b border-[#D8D4CA] shadow-xl px-8 py-10 md:hidden flex flex-col space-y-6"
          >
            <div className="border-b border-[#171817]/10 pb-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#555650]">
                {navbarContent.mobileMenuHeading}
              </span>
            </div>

            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="font-serif text-2xl text-[#171817] hover:text-[#9C3C35] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[#555650]">{navbarContent.sectionSymbol}</span>
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#171817]/10 flex flex-col space-y-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 bg-[#171817] text-[#FCFBF7] text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#9C3C35] transition-colors"
              >
                <span>{FIRM_INFO.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center font-mono text-[11px] text-[#555650]">
                {FIRM_INFO.phone} • {FIRM_INFO.address.split(",")[0]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
