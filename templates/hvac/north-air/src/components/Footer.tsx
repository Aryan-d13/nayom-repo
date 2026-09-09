"use client";

import React from "react";
import { useAir } from "@/context/AirContext";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { footerContent, companyInfo } from "@/data/content";

export default function Footer() {
  const { setIsBookingOpen, setBookingService } = useAir();

  const handleServiceClick = (serviceName: string) => {
    setBookingService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <footer className="w-full bg-[#F4F1E9] text-[#202321] border-t border-[#202321]/15 pt-20 sm:pt-28 pb-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Massive Brand & Tagline */}
        <div className="pb-16 sm:pb-24 border-b border-[#202321]/15">
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-none text-[#202321] font-sans">
            {footerContent.brand}
          </h2>
          <p className="mt-4 sm:mt-6 text-2xl sm:text-4xl lg:text-5xl font-serif italic text-[#607F87]">
            {footerContent.tagline}
          </p>
        </div>

        {/* 4 Columns: Services, Links, Location/Contact, Hours */}
        <div className="py-14 sm:py-20 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-sm">
          {/* Services */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#202321]/50 mb-5">
              {footerContent.servicesHeader}
            </h3>
            <ul className="space-y-3 font-medium">
              {footerContent.services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleServiceClick(service)}
                    className="hover:text-[#607F87] transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#202321]/50 mb-5">
              {footerContent.navHeader}
            </h3>
            <ul className="space-y-3 font-medium">
              {footerContent.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[#607F87] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setBookingService("General Inquiry");
                    setIsBookingOpen(true);
                  }}
                  className="hover:text-[#607F87] transition-colors text-left"
                >
                  {footerContent.contactLinkText}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#202321]/50 mb-5">
              {footerContent.officeHeader}
            </h3>
            <div className="space-y-3 font-medium">
              <p className="flex items-center gap-2 text-[#202321]">
                <MapPin className="w-4 h-4 text-[#607F87]" />
                <span>{companyInfo.location}</span>
              </p>
              <p>
                <a
                  href={`tel:${companyInfo.phoneTel}`}
                  className="flex items-center gap-2 text-[#202321] hover:text-[#607F87] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#607F87]" />
                  <span>{companyInfo.phone}</span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-2 text-[#202321] hover:text-[#607F87] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#607F87]" />
                  <span>{companyInfo.email}</span>
                </a>
              </p>
            </div>
          </div>

          {/* Working Hours & Prompt Visit */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#202321]/50 mb-5">
              {footerContent.hoursHeader}
            </h3>
            <div className="space-y-3 font-medium">
              <p className="flex items-center gap-2 text-[#202321]">
                <Clock className="w-4 h-4 text-[#607F87]" />
                <span>{companyInfo.hours}</span>
              </p>
              <p className="text-xs text-[#202321]/60 pt-2 leading-relaxed">
                {footerContent.hoursNote}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#202321]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#202321]/60 gap-4">
          <p>{footerContent.copyright}</p>
          <p className="tracking-wide">{footerContent.promise}</p>
        </div>
      </div>
    </footer>
  );
}
