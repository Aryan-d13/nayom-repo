"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Phone } from "lucide-react";
import { navigationContent, businessInfo } from "@/data/content";

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-asphalt border-b border-white/10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left: Workshop Label Brand */}
          <Link
            href="#"
            className="flex items-center gap-2.5 text-road-white group focus:outline-none focus:ring-1 focus:ring-signal-red px-1 py-0.5"
            aria-label={`${businessInfo.name} Home`}
          >
            <div className="w-2.5 h-2.5 bg-signal-red rounded-none ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-150" />
            <span className="font-display font-bold tracking-widest text-sm uppercase text-road-white group-hover:text-white transition-colors">
              {navigationContent.brandTitle}
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono tracking-widest uppercase text-metal px-1.5 py-0.5 border border-white/10 bg-white/5">
              {navigationContent.badge}
            </span>
          </Link>

          {/* Center: Monospaced Workshop Index */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navigationContent.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-metal hover:text-road-white transition-colors duration-150 py-1 border-b border-transparent hover:border-metal focus:outline-none focus:text-road-white"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right: Sharp Action Block */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={businessInfo.phoneRaw}
              className="text-xs font-mono text-metal hover:text-road-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-signal-red" />
              {navigationContent.phone}
            </a>
            <a
              href="#booking"
              className="font-display text-xs uppercase font-bold tracking-wider px-3.5 py-2 bg-road-white text-asphalt hover:bg-white hover:text-black transition-all flex items-center gap-1.5 border border-white/20 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-signal-red"
            >
              <span>{navigationContent.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-signal-red" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-2 px-2.5 py-1.5 border border-white/20 bg-white/5 text-xs font-mono uppercase tracking-wider text-road-white hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-signal-red"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-signal-red" />
                <span>CLOSE</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-metal" />
                <span>MENU</span>
              </>
            )}
          </button>
        </div>

        {/* Scroll Progress Status Line */}
        <div className="w-full h-[2px] bg-white/5 relative">
          <div
            className="h-full bg-signal-red transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page scroll progress"
          />
        </div>
      </header>

      {/* Mobile Drawer (workshop tool chest drawer slide) */}
      <div
        className={`fixed inset-x-0 top-[58px] z-40 bg-asphalt border-b border-metal/30 shadow-2xl transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] font-mono uppercase tracking-widest text-metal">
            <span>{navigationContent.drawerHeader}</span>
            <span className="text-signal-red font-semibold">{navigationContent.drawerStatus}</span>
          </div>

          <div className="flex flex-col space-y-4">
            {navigationContent.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-xl font-bold uppercase tracking-wide text-road-white hover:text-signal-red transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="font-mono text-xs text-metal">→</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
            <a
              href={businessInfo.phoneRaw}
              className="w-full py-3 px-4 border border-white/20 bg-white/5 text-sm font-mono text-road-white flex items-center justify-between"
            >
              <span>{navigationContent.drawerCallLabel}</span>
              <span className="text-signal-red font-bold">{navigationContent.phone}</span>
            </a>
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 bg-signal-red text-white text-sm font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{navigationContent.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[11px] font-mono text-metal flex items-center justify-between pt-2">
            <span>{navigationContent.drawerAddress}</span>
            <span>{navigationContent.drawerHours}</span>
          </div>
        </div>
      </div>
    </>
  );
}
