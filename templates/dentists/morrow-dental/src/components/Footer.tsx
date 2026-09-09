import React from "react";
import Link from "next/link";
import { footerContent, clinicData } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-porcelain text-ink pt-20 pb-16 border-t border-stone/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone/30">
          {/* Brand & Tagline */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-sans font-medium tracking-tight text-ink uppercase mb-3">
                {footerContent.brand}
              </h2>
              <p className="font-serif italic text-xl sm:text-2xl text-ink/70 font-light">
                {footerContent.tagline}
              </p>
            </div>
            <div className="mt-8 md:mt-0 text-xs font-mono text-ink/50 tracking-widest uppercase">
              {footerContent.locationLabel}
            </div>
          </div>

          {/* Details & Address */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-2">
                {footerContent.locationHeading}
              </span>
              <p className="text-sm font-light text-ink/80 leading-relaxed">
                {footerContent.addressLine1}
                <br />
                {footerContent.addressLine2}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-2">
                {footerContent.hoursHeading}
              </span>
              <p className="text-sm font-light text-ink/80">{footerContent.hours}</p>
            </div>

            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-2">
                {footerContent.directHeading}
              </span>
              <p className="text-sm font-light text-ink/80">
                <a
                  href={`tel:${clinicData.phoneRaw}`}
                  className="hover:underline block"
                >
                  {footerContent.phone}
                </a>
                <a
                  href={`mailto:${footerContent.email}`}
                  className="hover:underline block"
                >
                  {footerContent.email}
                </a>
              </p>
            </div>
          </div>

          {/* Editorial Navigation */}
          <div className="md:col-span-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-4">
              {footerContent.indexHeading}
            </span>
            <ul className="space-y-3">
              {footerContent.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-light text-ink/70 hover:text-ink transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-ink/40 tracking-wider">
          <span>{footerContent.copyright}</span>
          <span className="mt-2 sm:mt-0 uppercase">{footerContent.taglineEnd}</span>
        </div>
      </div>
    </footer>
  );
}
