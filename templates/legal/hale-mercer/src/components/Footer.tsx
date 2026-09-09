"use client";

import React from "react";
import { FIRM_INFO, NAV_LINKS, footerContent } from "@/data/content";

interface FooterProps {
  onOpenContact: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#F1EEE7] border-t border-[#171817]/15 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#171817]/10">
          {/* Brand & Address */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-[#171817]">
                {FIRM_INFO.name}
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-[#555650] mt-0.5">
                {FIRM_INFO.suffix}
              </p>
            </div>

            <div className="font-mono text-xs text-[#555650] space-y-1 pt-2">
              <p>{FIRM_INFO.address}</p>
              <p>
                <a
                  href={`tel:${FIRM_INFO.phone.replace(/[^0-9]/g, "")}`}
                  className="hover:text-[#171817] transition-colors"
                >
                  {FIRM_INFO.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${FIRM_INFO.email}`}
                  className="hover:text-[#171817] transition-colors"
                >
                  {FIRM_INFO.email}
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#555650] mb-4">
              {footerContent.directoryHeading}
            </div>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-wider text-[#555650]">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo(link.href);
                    }}
                    className="hover:text-[#171817] hover:underline decoration-[#9C3C35] underline-offset-4 transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-[#171817] hover:underline decoration-[#9C3C35] underline-offset-4 transition-all text-left uppercase"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial statement */}
          <div className="md:col-span-3 font-mono text-xs text-[#555650] space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555650]">
              {footerContent.chambersNoteHeading}
            </div>
            <p className="leading-relaxed">
              &ldquo;{FIRM_INFO.tagline}&rdquo;
            </p>
            <p className="text-[11px] text-[#555650]/80 leading-relaxed">
              {footerContent.jurisdictionNote}
            </p>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[11px] text-[#555650]">
          <p className="max-w-2xl leading-relaxed">
            {footerContent.legalDisclaimer}
          </p>
          <p className="shrink-0">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
