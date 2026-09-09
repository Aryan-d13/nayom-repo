"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";
import { businessInfo, navigationContent } from "@/data/content";

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = navigationContent.navLinks;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#F3EFE7]/90 backdrop-blur-md border-b border-[#17252A]/10 shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3] rounded-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-[#17252A]">
                {businessInfo.name}
              </span>
              <span className="font-light text-lg sm:text-xl tracking-wider text-[#68B8C3]">
                {businessInfo.nameSuffix}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#17252A]/60 -mt-0.5">
              {businessInfo.location}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-wider text-[#17252A]/75 hover:text-[#17252A] transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#17252A] hover:text-[#C86650] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#68B8C3]" />
              <span>{businessInfo.phone}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17252A] hover:bg-[#17252A]/90 text-[#FFFDF8] text-xs font-medium uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
            >
              <span>{navigationContent.ctaButton}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#68B8C3]" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onOpenBooking}
              className="text-xs px-3 py-1.5 rounded-full bg-[#C86650] text-[#FFFDF8] font-medium"
            >
              {navigationContent.mobileCta}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#17252A] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF8] border-b border-[#17252A]/10 px-6 py-5 shadow-lg space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#17252A]/80 hover:text-[#17252A] py-1 border-b border-[#17252A]/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#17252A]"
            >
              <Phone className="w-4 h-4 text-[#68B8C3]" />
              {businessInfo.phone}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl bg-[#C86650] text-[#FFFDF8] text-center text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              {navigationContent.mobileDrawerCta}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
