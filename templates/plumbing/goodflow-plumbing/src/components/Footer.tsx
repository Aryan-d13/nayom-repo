"use client";

import React from "react";
import { COMPANY, footerContent } from "@/data/content";

interface FooterProps {
  onOpenBooking: () => void;
}

export function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer className="bg-[#F4F0E7] text-[#15212A] pt-16 sm:pt-20 pb-12 border-t border-[#15212A]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-[#15212A]/10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-5">
            <span className="text-xl sm:text-2xl font-normal tracking-tight text-[#15212A] block">
              {COMPANY.name}
            </span>
            <p className="font-serif italic text-lg sm:text-xl text-[#397A91] mt-1">
              {COMPANY.tagline}
            </p>
            <p className="text-xs text-[#15212A]/60 font-mono mt-4 max-w-sm">
              {footerContent.description}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#15212A]/50 block mb-3">
              {footerContent.navTitle}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm uppercase tracking-wider text-[#15212A]/80 font-medium">
              {footerContent.navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="editorial-link hover:text-[#15212A]">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="editorial-link hover:text-[#397A91] text-left cursor-pointer uppercase"
                >
                  Book a Plumber
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Areas */}
          <div className="lg:col-span-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#15212A]/50 block mb-3">
              {footerContent.serviceAreasTitle}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#15212A]/80 font-normal">
              {COMPANY.serviceAreas.map((area) => (
                <li key={area} className="hover:text-[#397A91] transition-colors">
                  {area}, OR
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="lg:col-span-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#15212A]/50 block mb-3">
              {footerContent.contactTitle}
            </span>
            <div className="space-y-2 text-xs sm:text-sm text-[#15212A]/80 font-normal">
              <div>
                <a
                  href={COMPANY.phoneRaw}
                  className="font-mono text-sm sm:text-base font-medium text-[#15212A] hover:text-[#397A91] transition-colors block"
                >
                  {COMPANY.phone}
                </a>
                <span className="text-[11px] text-[#15212A]/60">
                  {footerContent.dispatchLabel}
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="editorial-link hover:text-[#397A91]"
                >
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet & Minimal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#15212A]/50 font-mono gap-4">
          <p>{footerContent.copyright}</p>
          <p>{footerContent.locationNote}</p>
        </div>
      </div>
    </footer>
  );
}
