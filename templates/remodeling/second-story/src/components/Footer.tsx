"use client";

import React from "react";
import { BRAND, footerContent } from "@/data/content";
import { ArrowUp } from "lucide-react";

interface FooterProps {
  onOpenInquiry: () => void;
}

export default function Footer({ onOpenInquiry }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone text-ink py-20 md:py-28 px-6 md:px-12 border-t border-stone/80">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-ink/15">
          {/* Brand & Tagline */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-semibold tracking-[0.24em] text-2xl sm:text-3xl text-ink uppercase">
                {BRAND.name}
              </h3>
              <p className="font-serif italic text-lg sm:text-xl text-ink/80 mt-2">
                {BRAND.tagline}
              </p>
              <p className="mt-4 font-sans text-xs text-ink/70 max-w-sm leading-relaxed">
                {footerContent.description}
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenInquiry}
                className="px-5 py-2.5 bg-ink text-chalk text-xs tracking-[0.16em] uppercase hover:bg-terracotta transition-colors rounded-xs cursor-pointer"
              >
                {BRAND.primaryCTA} →
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs text-ink/50 tracking-widest uppercase mb-4">
              {footerContent.navHeading}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <a href="#work" className="text-ink/80 hover:text-ink hover:underline">
                  Work
                </a>
              </li>
              <li>
                <a href="#process" className="text-ink/80 hover:text-ink hover:underline">
                  Process
                </a>
              </li>
              <li>
                <a href="#about" className="text-ink/80 hover:text-ink hover:underline">
                  About
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenInquiry}
                  className="text-ink/80 hover:text-ink hover:underline cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs text-ink/50 tracking-widest uppercase mb-4">
              {footerContent.servicesHeading}
            </h4>
            <ul className="space-y-3 font-sans text-sm text-ink/80">
              {footerContent.services.map((svc) => (
                <li key={svc}>{svc}</li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs text-ink/50 tracking-widest uppercase mb-4">
              {footerContent.contactHeading}
            </h4>
            <div className="space-y-3 font-sans text-sm">
              <p>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="text-ink/90 hover:text-terracotta font-mono font-medium transition-colors"
                >
                  {BRAND.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-ink/80 hover:text-ink hover:underline"
                >
                  {BRAND.email}
                </a>
              </p>
              <p className="text-ink/70">
                {BRAND.location}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink/50">
          <div>{footerContent.copyright}</div>

          <div className="flex items-center gap-6">
            <span>{footerContent.location}</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-ink/70 hover:text-ink transition-colors cursor-pointer"
            >
              <span>{footerContent.topLabel}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
