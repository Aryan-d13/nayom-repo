"use client";

import React from "react";
import { footerContent } from "@/data/content";

interface FooterProps {
  onOpenVisitModal: () => void;
}

export default function Footer({ onOpenVisitModal }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#F5F1E8] text-[#20231F] pt-20 pb-12 px-6 sm:px-8 lg:px-12 border-t border-[#20231F]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#20231F]/10">
          {/* Col 1: Large Brand & Tagline */}
          <div className="md:col-span-6 lg:col-span-5">
            <h2 className="font-serif-title text-4xl sm:text-6xl font-black tracking-tight text-[#20231F]">
              {footerContent.name}
            </h2>
            <p className="font-serif-title text-2xl sm:text-3xl italic text-[#4E7FA3] mt-2">
              {footerContent.tagline}
            </p>
            <p className="text-sm text-[#20231F]/75 mt-4 max-w-sm leading-relaxed">
              {footerContent.lead}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#73866C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#73866C] font-semibold">
                {footerContent.campusOpenBadge}
              </span>
            </div>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="md:col-span-3 lg:col-span-4 flex flex-col justify-start">
            <span className="text-xs uppercase font-bold tracking-widest text-[#20231F]/50 font-mono mb-4">
              {footerContent.campusContactHeading}
            </span>
            <address className="not-italic text-sm sm:text-base text-[#20231F]/90 space-y-1 font-sans">
              <p className="font-semibold">{footerContent.address}</p>
              <p>{footerContent.location}</p>
              <p className="pt-2">
                <a
                  href={`tel:${footerContent.phone.replace(/[^0-9]/g, "")}`}
                  className="font-mono font-bold hover:text-[#D76C56] transition-colors"
                >
                  {footerContent.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${footerContent.email}`}
                  className="hover:underline underline-offset-4 text-[#4E7FA3] font-medium"
                >
                  {footerContent.email}
                </a>
              </p>
            </address>

            <div className="mt-6 pt-4 border-t border-[#20231F]/10">
              <span className="text-xs uppercase font-mono tracking-wider text-[#20231F]/60 block">
                {footerContent.officeHoursHeading}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#20231F]">
                {footerContent.hours}
              </span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#20231F]/50 font-mono mb-4 block">
              {footerContent.navigationHeading}
            </span>
            <ul className="space-y-3 text-sm font-medium">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.targetId)}
                    className="hover:text-[#4E7FA3] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenVisitModal}
                  className="text-[#D76C56] font-bold hover:underline underline-offset-4 cursor-pointer"
                >
                  {footerContent.visitCta}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#20231F]/60 gap-4">
          <p className="font-sans italic">{footerContent.disclaimer}</p>
          <p className="font-mono">{footerContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
