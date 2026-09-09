"use client";

import { useState, useEffect } from "react";
import { BRAND, NAV_LINKS } from "@/data/content";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenProjectModal: () => void;
}

export default function Navbar({ onOpenProjectModal }: NavbarProps) {
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-warm-white/90 backdrop-blur-md border-b border-dust/40 py-3.5 shadow-[0_2px_15px_-5px_rgba(35,35,33,0.05)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between gap-6 lg:gap-10">
        {/* Brand Wordmark */}
        <a
          href="#"
          className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta shrink-0"
          aria-label={`${BRAND.name} Home`}
        >
          <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-ink group-hover:text-terracotta transition-colors duration-300">
            {BRAND.name}
          </span>
          <span className="text-[10px] tracking-[0.25em] text-moss uppercase font-medium mt-0.5">
            {BRAND.descriptor} · {BRAND.location.split(",")[0]}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center space-x-6 xl:space-x-8 shrink-0"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.16em] text-ink/75 hover:text-ink hover:border-b hover:border-terracotta/60 transition-all duration-200 pb-0.5 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Phone */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="hidden xl:flex items-center text-xs tracking-wider text-ink/80 hover:text-ink transition-colors group whitespace-nowrap"
            aria-label={`Call ${BRAND.name} at ${BRAND.phone}`}
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-moss group-hover:text-terracotta transition-colors shrink-0" />
            <span className="whitespace-nowrap">{BRAND.phone}</span>
          </a>

          <button
            onClick={onOpenProjectModal}
            className="relative px-5 py-2.5 bg-ink text-warm-white text-xs uppercase tracking-[0.15em] font-medium rounded-none hover:bg-moss active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta whitespace-nowrap shrink-0"
          >
            <span>{BRAND.primaryCTA}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center space-x-3">
          <button
            onClick={onOpenProjectModal}
            className="px-3.5 py-2 bg-ink text-warm-white text-[11px] uppercase tracking-wider font-medium"
          >
            {BRAND.mobilePlanCta}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:text-terracotta focus:outline-none"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-warm-white border-b border-dust px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-[0.18em] text-ink font-medium hover:text-terracotta transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-dust/60 flex flex-col space-y-4">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="flex items-center text-sm tracking-wide text-ink/90"
            >
              <Phone className="w-4 h-4 mr-2.5 text-moss" />
              <span>{BRAND.phone}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProjectModal();
              }}
              className="w-full py-3 bg-ink text-warm-white text-xs uppercase tracking-[0.18em] font-medium text-center"
            >
              {BRAND.primaryCTA} →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
