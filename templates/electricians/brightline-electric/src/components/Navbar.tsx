"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Phone, Menu, X } from "lucide-react";
import { navigationContent, businessInfo } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
  activeSection?: string;
}

export default function Navbar({ onOpenBooking, activeSection = "hero" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = navigationContent.links;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F3F0E8] text-[#11110F] border-b border-[#E2DDD2] shadow-xs py-3"
          : "bg-transparent text-[#FFFFFF] py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Minimal Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 tracking-[0.2em] text-xs font-semibold uppercase transition-colors"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full bg-[#BDF45B] transition-opacity duration-300 ${
              scrolled ? "opacity-100 ring-2 ring-[#BDF45B]/40" : "opacity-90"
            }`}
          />
          <span
            className={`font-semibold tracking-[0.22em] text-sm transition-colors ${
              scrolled ? "text-[#11110F]" : "text-[#FFFFFF]"
            }`}
          >
            {navigationContent.logo}
          </span>
        </a>

        {/* Center: Clean Minimal Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.08em] font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 group ${
                  scrolled
                    ? isActive
                      ? "text-[#11110F] font-semibold"
                      : "text-[#55554F] hover:text-[#11110F]"
                    : isActive
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#C9C6BD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>{link.name}</span>
                {/* Underline expansion on hover & active lime indicator */}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#BDF45B] transition-all duration-200 ease-out ${
                    isActive
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right: Phone & Primary CTA */}
        <div className="hidden sm:flex items-center gap-6">
          <a
            href={businessInfo.phoneTel}
            className={`flex items-center gap-1.5 text-[13px] tracking-wide font-medium transition-colors ${
              scrolled
                ? "text-[#474740] hover:text-[#11110F]"
                : "text-[#C9C6BD] hover:text-[#FFFFFF]"
            }`}
          >
            <Phone className="w-3.5 h-3.5 opacity-70" />
            <span>{navigationContent.phone}</span>
          </a>

          <button
            onClick={onOpenBooking}
            className={`cta-sweep group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-200 ${
              scrolled
                ? "bg-[#11110F] text-[#FFFFFF] hover:bg-[#252522]"
                : "bg-[#FFFFFF] text-[#11110F] hover:bg-[#F3F0E8]"
            }`}
          >
            <span>{navigationContent.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-3">
          <button
            onClick={onOpenBooking}
            className={`text-xs px-3 py-1.5 font-semibold uppercase tracking-wider ${
              scrolled ? "bg-[#11110F] text-[#FFFFFF]" : "bg-[#FFFFFF] text-[#11110F]"
            }`}
          >
            {navigationContent.mobileCtaText}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className={`p-1.5 transition-colors ${
              scrolled ? "text-[#11110F]" : "text-[#FFFFFF]"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#F3F0E8] text-[#11110F] border-b border-[#E2DDD2] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#2B2B27] hover:text-[#11110F] flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#E2DDD2] flex flex-col gap-3">
            <a
              href={businessInfo.phoneTel}
              className="flex items-center gap-2 text-sm font-medium text-[#11110F]"
            >
              <Phone className="w-4 h-4 text-[#75756C]" />
              <span>{navigationContent.phone}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 bg-[#11110F] text-[#FFFFFF] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <span>{navigationContent.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
