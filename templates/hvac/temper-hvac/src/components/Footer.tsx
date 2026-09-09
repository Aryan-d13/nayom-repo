"use client";

import React from "react";
import { useTemperature } from "@/context/TemperatureContext";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { footerContent, businessInfo } from "@/data/content";

export default function Footer() {
  const { openBooking } = useTemperature();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-[#344247] text-[#FCFCF9] pt-20 pb-12 px-6 sm:px-8 lg:px-12 border-t border-[#43545A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-sans text-4xl sm:text-5xl font-black tracking-[0.2em] text-white">
              {footerContent.brand}
            </h3>
            <p className="font-serif italic text-2xl text-[#E9D9BE] font-light">
              {footerContent.tagline}
            </p>
            <p className="text-xs sm:text-sm text-[#C8DDE0]/80 font-light max-w-sm leading-relaxed pt-2">
              {footerContent.description}
            </p>
          </div>

          {/* Services Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E9D9BE]">
              {footerContent.servicesHeader}
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#FCFCF9]/80">
              {footerContent.services.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="hover:text-[#E9D9BE] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E9D9BE]">
              {footerContent.navHeader}
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#FCFCF9]/80">
              {footerContent.links.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="hover:text-[#E9D9BE] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E9D9BE]">
              {footerContent.contactHeader}
            </h4>
            <div className="space-y-3 text-xs text-[#FCFCF9]/80">
              <a
                href={`tel:${businessInfo.phoneTel}`}
                className="flex items-center gap-2.5 hover:text-[#E9D9BE] transition-colors font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#C8DDE0]" />
                <span>{footerContent.phone}</span>
              </a>
              <a
                href={`mailto:${footerContent.email}`}
                className="flex items-center gap-2.5 hover:text-[#E9D9BE] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C8DDE0]" />
                <span>{footerContent.email}</span>
              </a>
              <div className="flex items-center gap-2.5 text-[#FCFCF9]/70">
                <MapPin className="w-3.5 h-3.5 text-[#C8DDE0]" />
                <span>{footerContent.location}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openBooking(footerContent.footerBookingIssue)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E9D9BE] hover:text-white transition-colors cursor-pointer border-b border-[#E9D9BE]/40 pb-0.5"
                >
                  <span>{footerContent.bookCta}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#C8DDE0]/60">
          <p>{footerContent.copyright}</p>
          <p className="font-mono text-[10px] tracking-wider">
            {footerContent.comfortArchitecture}
          </p>
        </div>
      </div>
    </footer>
  );
}
