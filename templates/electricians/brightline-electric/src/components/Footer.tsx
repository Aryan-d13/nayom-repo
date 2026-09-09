"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { footerContent, businessInfo } from "@/data/content";

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const serviceAreas = footerContent.serviceAreas;

  return (
    <footer className="bg-[#11110F] text-[#FFFFFF] border-t border-[#22221E] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#22221E]">
          {/* Brand Col (cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BDF45B]" />
              <span className="text-base font-semibold tracking-[0.22em] text-[#FFFFFF] uppercase">
                {footerContent.brand}
              </span>
            </div>
            <p className="text-xl font-serif italic text-[#E5E2D9]">
              {footerContent.tagline}
            </p>
            <p className="text-xs sm:text-sm text-[#88887E] max-w-sm leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Quick Links (cols 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#A8A89E]">
              {footerContent.navHeader}
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C9C6BD]">
              {footerContent.links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-[#FFFFFF] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-[#FFFFFF] transition-colors text-left"
                >
                  {footerContent.bookingLinkText}
                </button>
              </li>
            </ul>
          </div>

          {/* Service Areas (cols 9-10) */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#A8A89E]">
              {footerContent.serviceAreasHeader}
            </p>
            <ul className="space-y-2 text-xs text-[#C9C6BD]">
              {serviceAreas.map((area) => (
                <li key={area} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#3D3D35]" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (cols 11-12) */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#A8A89E]">
              {footerContent.contactHeader}
            </p>
            <div className="space-y-2 text-xs text-[#C9C6BD]">
              <a
                href={businessInfo.phoneTel}
                className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#BDF45B]" />
                <span>{footerContent.phone}</span>
              </a>
              <a
                href={businessInfo.emailHref}
                className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5 break-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#88887E]" />
                <span>{footerContent.email}</span>
              </a>
              <div className="flex items-center gap-1.5 text-[#88887E]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{footerContent.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#66665E] gap-4">
          <p>{footerContent.copyright}</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
              <span>{footerContent.statusNote}</span>
            </span>
            <span>{footerContent.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
