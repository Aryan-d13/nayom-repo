import React from "react";
import { clinicInfo, footerLinks, footerContent } from "@/data/content";

export default function Footer() {
  return (
    <footer className="bg-bone text-ink border-t border-stone/30 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-stone/30">
          {/* Brand & Tagline */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-widest text-ink mb-2">
                {clinicInfo.name}
              </h2>
              <p className="font-serif italic text-lg sm:text-xl text-ink-muted">
                {clinicInfo.tagline}
              </p>
            </div>
            <p className="hidden md:block text-xs text-ink/40 tracking-wider pt-8">
              {footerContent.descriptor}
            </p>
          </div>

          {/* Clinic Information */}
          <div className="md:col-span-3 lg:col-span-4 space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
            <p className="font-medium text-ink uppercase tracking-wider text-[11px] mb-3">
              {footerContent.studioHeading}
            </p>
            <p>{clinicInfo.address}</p>
            <p>{clinicInfo.location}</p>
            <p className="pt-2">
              <a
                href={`tel:${clinicInfo.phoneRaw}`}
                className="text-ink hover:text-clay transition-colors"
              >
                {clinicInfo.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${clinicInfo.email}`}
                className="text-ink hover:text-clay transition-colors"
              >
                {clinicInfo.email}
              </a>
            </p>
            <p className="pt-2 text-ink/70">{clinicInfo.hours}</p>
          </div>

          {/* Navigation & External Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <p className="font-medium text-ink uppercase tracking-wider text-[11px] mb-3">
              {footerContent.indexHeading}
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-ink-muted hover:text-ink transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Quiet Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink/50 tracking-wider">
          <p>{clinicInfo.copyright}</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            {footerContent.bottomNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
