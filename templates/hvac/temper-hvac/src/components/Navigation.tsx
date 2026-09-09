"use client";

import React, { useState, useEffect } from "react";
import { useTemperature } from "@/context/TemperatureContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Menu } from "lucide-react";
import { navigationContent, businessInfo } from "@/data/content";

export default function Navigation() {
  const { openBooking } = useTemperature();
  const [scrollRatio, setScrollRatio] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate smooth gradual transition over the first 600px of scroll
      const y = window.scrollY;
      const ratio = Math.min(Math.max(y / 500, 0), 1);
      setScrollRatio(ratio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Interpolate between warm cream (#F6F2EA / rgba(246, 242, 234, ...))
  // and cool pale-blue / sky (#C8DDE0 / rgba(200, 221, 224, ...))
  // We use CSS custom blend based on scroll ratio
  const navBg = `rgba(${Math.round(246 - scrollRatio * (246 - 200))}, ${Math.round(
    242 - scrollRatio * (242 - 221)
  )}, ${Math.round(234 - scrollRatio * (234 - 224))}, ${0.82 + scrollRatio * 0.15})`;

  const borderColor = `rgba(${Math.round(233 - scrollRatio * 50)}, ${Math.round(
    217 - scrollRatio * 20
  )}, ${Math.round(190 + scrollRatio * 20)}, ${0.4 + scrollRatio * 0.3})`;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-500 backdrop-blur-md"
        style={{
          backgroundColor: navBg,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Brand Left */}
          <a
            href="#"
            className="group flex flex-col items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm py-1"
          >
            <span className="font-sans font-semibold tracking-[0.25em] text-sm text-ink group-hover:text-terracotta transition-colors uppercase">
              {navigationContent.brand}
            </span>
            <span className="text-[10px] tracking-widest text-slate uppercase opacity-80">
              {navigationContent.locationShort}
            </span>
          </a>

          {/* Desktop Center Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 lg:gap-12"
          >
            {navigationContent.navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs uppercase tracking-[0.2em] text-ink/80 hover:text-terracotta transition-colors py-1 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="text-xs tracking-wider text-slate/80 hover:text-ink transition-colors font-mono hidden lg:inline-block"
            >
              {navigationContent.phone}
            </a>
            <button
              type="button"
              onClick={() => openBooking()}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate/30 bg-ink text-white hover:bg-terracotta hover:border-terracotta transition-all duration-300 text-xs uppercase tracking-[0.18em] shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>{navigationContent.bookCta}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Right: TEMPER + MENU */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-ink/20 text-ink text-xs uppercase tracking-[0.2em] hover:border-terracotta transition-colors cursor-pointer"
            >
              <span>{navigationContent.menuButton}</span>
              <Menu className="w-4 h-4 text-slate" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Split Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col md:hidden"
          >
            {/* Top Half Warm (Terracotta & Sand) */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-1 bg-[#E9D9BE] flex flex-col justify-end px-8 pb-8 pt-16 border-b border-terracotta/30"
            >
              <div className="absolute top-6 left-6 flex flex-col">
                <span className="font-sans font-bold tracking-[0.25em] text-xs text-ink uppercase">
                  {navigationContent.brand}
                </span>
                <span className="text-[10px] tracking-widest text-slate uppercase">
                  {navigationContent.trade}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
                className="absolute top-6 right-6 p-2 rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-terracotta font-semibold">
                  {navigationContent.warmthHeading}
                </span>
                <div className="flex flex-col gap-3">
                  {navigationContent.navLinks.slice(0, 2).map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="font-serif italic text-3xl text-ink hover:text-terracotta transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom Half Cool (Sky & Slate) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-1 bg-[#C8DDE0] flex flex-col justify-between px-8 pt-8 pb-10"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate font-semibold">
                  {navigationContent.airHeading}
                </span>
                <div className="flex flex-col gap-3">
                  {navigationContent.navLinks.slice(2).map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="font-serif italic text-3xl text-ink hover:text-slate transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate/20">
                <div className="flex items-center justify-between">
                  <a
                    href={`tel:${businessInfo.phoneTel}`}
                    className="text-sm font-mono text-slate tracking-wider"
                  >
                    {navigationContent.phone}
                  </a>
                  <span className="text-xs text-slate/70">{navigationContent.locationShort}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBooking();
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-ink text-white font-sans text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-terracotta transition-colors cursor-pointer"
                >
                  <span>{navigationContent.bookCta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
