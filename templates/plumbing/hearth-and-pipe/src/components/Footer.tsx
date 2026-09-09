"use client";

import { footerContent, businessInfo } from "@/data/content";

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const { services, links } = footerContent;

  return (
    <footer id="contact" className="bg-[#D4D0C7] text-[#242522] pt-24 pb-16 px-6 md:px-12 border-t border-[#A86F4F]/30">
      <div className="max-w-7xl mx-auto">
        {/* Top: Large Brand Name & Tagline */}
        <div className="mb-16 md:mb-20 pb-12 border-b border-[#242522]/15">
          <h2 className="text-3xl sm:text-5xl md:text-6xl tracking-[0.16em] uppercase font-semibold text-[#242522] mb-3">
            {businessInfo.name}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#242522]/75 font-normal">
            {businessInfo.tagline}
          </p>
        </div>

        {/* Middle: 3 Columns of architectural information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-sm">
          {/* Col 1: Services */}
          <div>
            <h3 className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#A86F4F] mb-6">
              {footerContent.servicesHeader}
            </h3>
            <ul className="space-y-3 font-medium text-[#242522]/80">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={onOpenBooking}
                    className="hover:text-[#242522] hover:translate-x-1 transition-transform text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#A86F4F] mb-6">
              {footerContent.exploreHeader}
            </h3>
            <ul className="space-y-3 font-medium text-[#242522]/80">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#242522] hover:translate-x-1 transition-transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-[#242522] hover:translate-x-1 transition-transform inline-block font-semibold text-[#242522]"
                >
                  {footerContent.bookLinkText}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Location & Phone */}
          <div>
            <h3 className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#A86F4F] mb-6">
              {footerContent.officeHeader}
            </h3>
            <p className="text-[#242522]/80 mb-2 font-medium">
              {businessInfo.cityState}
            </p>
            <p className="mb-4">
              <a
                href={`tel:${businessInfo.phoneTel}`}
                className="font-mono text-[14px] text-[#242522] hover:text-[#A86F4F] transition-colors"
              >
                {businessInfo.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${businessInfo.email}`}
                className="text-[#242522]/80 hover:text-[#242522] underline underline-offset-4 decoration-[#A86F4F]/60 transition-colors"
              >
                {businessInfo.email}
              </a>
            </p>
          </div>

          {/* Col 4: Hours & Schedule */}
          <div>
            <h3 className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#A86F4F] mb-6">
              {footerContent.hoursHeader}
            </h3>
            <p className="text-[#242522]/80 font-medium mb-1">
              {businessInfo.hours}
            </p>
            <p className="text-[12px] text-[#242522]/60 leading-relaxed mt-4">
              {businessInfo.hoursNote}
            </p>
          </div>
        </div>

        {/* Bottom: Legal & Copyright */}
        <div className="pt-8 border-t border-[#242522]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-[0.2em] text-[#242522]/60 uppercase gap-4">
          <p>{businessInfo.copyright}</p>
          <p>{businessInfo.motto}</p>
        </div>
      </div>
    </footer>
  );
}
