"use client";

import React from "react";

import { footerContent } from "@/data/content";

interface FooterSectionProps {
  onOpenMenu: () => void;
  onOpenFindUs: () => void;
}

export default function FooterSection({
  onOpenMenu,
  onOpenFindUs,
}: FooterSectionProps) {
  const scrollToReservation = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("reservation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#12100f] text-[#E9E2D4] border-t border-[#171514] py-16 sm:py-24 px-4 sm:px-8 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-start">
        {/* Brand & Address */}
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-[0.16em] uppercase text-[#F7F2E8]">
            {footerContent.brand}
          </h2>

          <div className="font-mono text-sm sm:text-base text-[#B7AEA0] space-y-1">
            <p>{footerContent.address[0]}</p>
            <p>{footerContent.address[1]}</p>
            <p className="pt-2 text-[#E6C875]">{footerContent.phone}</p>
          </div>
        </div>

        {/* Hours & Navigation */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-[11px] font-mono tracking-[0.24em] text-[#702F35] uppercase block font-semibold">
            {footerContent.hours.title}
          </span>
          <div className="font-mono text-sm text-[#B7AEA0] space-y-1">
            <p className="text-[#F7F2E8]">{footerContent.hours.days}</p>
            <p>{footerContent.hours.kitchen}</p>
            <p className="text-[#E6C875]">{footerContent.hours.bar}</p>
            <p className="pt-2 text-xs text-[#B7AEA0]/50">{footerContent.hours.closed}</p>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-[11px] font-mono tracking-[0.24em] text-[#702F35] uppercase block font-semibold">
            {footerContent.directory.title}
          </span>
          <ul className="space-y-2.5 font-mono text-sm uppercase tracking-wider text-[#B7AEA0]">
            {footerContent.directory.links.map((link) => {
              if ("action" in link && link.action === "openMenu") {
                return (
                  <li key={link.label}>
                    <button
                      onClick={onOpenMenu}
                      className="hover:text-[#F7F2E8] transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                );
              }
              if ("action" in link && link.action === "openFindUs") {
                return (
                  <li key={link.label}>
                    <button
                      onClick={onOpenFindUs}
                      className="hover:text-[#F7F2E8] transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                );
              }
              if ("type" in link && link.type === "scroll") {
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={scrollToReservation}
                      className="hover:text-[#F7F2E8] transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              }
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#F7F2E8] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl mx-auto mt-16 sm:mt-24 pt-8 border-t border-[#B7AEA0]/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#B7AEA0]/50 tracking-widest gap-4">
        <div>{footerContent.copyright}</div>
        <div className="flex items-center space-x-6 text-[11px]">
          <span>{footerContent.tagline}</span>
          <span>{footerContent.location}</span>
        </div>
      </div>
    </footer>
  );
}
