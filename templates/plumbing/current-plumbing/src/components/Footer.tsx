"use client";

import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { businessInfo, footerContent } from "@/data/content";

interface FooterProps {
  onOpenBooking: (service?: string) => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const services = footerContent.services;
  const quickLinks = footerContent.quickLinks;

  return (
    <footer className="bg-[#F3EFE7] border-t border-[#17252A]/15 pt-20 pb-12 text-[#17252A] overflow-hidden selection:bg-[#DDF0EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 pb-16 border-b border-[#17252A]/10">
          {/* Brand Column (4 cols on lg, full width on sm) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-none text-[#17252A]">
                  {businessInfo.name}
                </span>
                <span className="font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-[#68B8C3] mt-1">
                  {businessInfo.nameSuffix}
                </span>
              </div>

              <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#17252A]/80">
                {footerContent.tagline}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-[#17252A]/70 max-w-sm leading-relaxed">
                {footerContent.description}
              </p>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#17252A] text-[#FFFDF8] hover:bg-[#C86650] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <span>{footerContent.appointmentButton}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68B8C3]" />
              </button>
            </div>
          </div>

          {/* Services Column (3 cols) */}
          <div className="sm:col-span-1 lg:col-span-3 min-w-0">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#17252A]/50 mb-4">
              {footerContent.servicesHeader}
            </h4>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onOpenBooking(item.cat)}
                    className="text-sm text-[#17252A]/80 hover:text-[#C86650] transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#68B8C3] transition-colors shrink-0" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (3 cols on lg with ample space and safe wrapping) */}
          <div className="sm:col-span-1 lg:col-span-3 min-w-0">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#17252A]/50 mb-4">
              {footerContent.contactHeader}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#17252A]/80">
              <p>
                <a
                  href={`tel:${businessInfo.phoneTel}`}
                  className="hover:text-[#68B8C3] transition-colors inline-flex items-center gap-2 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#68B8C3] shrink-0" />
                  <span>{businessInfo.phone}</span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="hover:text-[#68B8C3] transition-colors inline-flex items-center gap-2 break-all sm:break-normal max-w-full"
                >
                  <Mail className="w-3.5 h-3.5 text-[#68B8C3] shrink-0" />
                  <span className="hover:underline">{businessInfo.email}</span>
                </a>
              </p>
              <p className="flex items-center gap-2 text-[#17252A]/70">
                <MapPin className="w-3.5 h-3.5 text-[#68B8C3] shrink-0" />
                <span>{businessInfo.locationFull}</span>
              </p>
            </div>
          </div>

          {/* Links Column (2 cols) */}
          <div className="sm:col-span-1 lg:col-span-2 min-w-0">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#17252A]/50 mb-4">
              {footerContent.linksHeader}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#17252A]/80">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#68B8C3] transition-colors block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#17252A]/60">
          <div>
            {businessInfo.copyright}
          </div>
          <div className="flex items-center gap-4">
            <span>{footerContent.coordinates}</span>
            <span className="w-1 h-1 rounded-full bg-[#68B8C3]" />
            <span>{footerContent.motto}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
