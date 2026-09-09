"use client";

import React from "react";
import { footerContent, clinicInfo } from "@/data/content";

interface FooterProps {
  onOpenBooking: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  return (
    <footer className="bg-ivory text-ink border-t border-dust py-20 lg:py-28 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-dust/70">
          {/* Brand & Clinic Identity */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-[0.12em] uppercase text-ink">
                {footerContent.brand}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-ink/60 font-medium">
                {footerContent.type}
              </p>
              <p className="mt-6 text-sm text-ink/75 max-w-sm leading-relaxed">
                {footerContent.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dust/60">
              <button
                onClick={onOpenBooking}
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-ink hover:text-sage font-medium transition-colors cursor-pointer flex items-center gap-2 group"
              >
                <span>{footerContent.ctaText}</span>
                <span className="text-sage transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-4 flex flex-col gap-6 text-xs uppercase tracking-[0.16em] text-ink/75">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-ink/40 mb-2">
                {footerContent.locationHeader}
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                {footerContent.addressLine1}
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                {footerContent.addressLine2}
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.25em] text-ink/40 mb-2">
                {footerContent.hoursHeader}
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                {footerContent.hoursLine1}
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                {footerContent.hoursLine2}
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.25em] text-ink/40 mb-2">
                {footerContent.contactHeader}
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                <a href={clinicInfo.phoneTel} className="hover:text-sage transition-colors">
                  {footerContent.phone}
                </a>
              </p>
              <p className="text-sm font-normal text-ink normal-case tracking-normal">
                <a href={clinicInfo.emailHref} className="hover:text-sage transition-colors">
                  {footerContent.email}
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-ink/40 mb-4">
                {footerContent.pagesHeader}
              </p>
              <ul className="space-y-3 text-xs uppercase tracking-[0.18em]">
                {footerContent.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-ink/75 hover:text-ink transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={onOpenBooking}
                    className="text-ink/75 hover:text-ink transition-colors uppercase tracking-[0.18em] cursor-pointer text-left"
                  >
                    {footerContent.bookingLinkText}
                  </button>
                </li>
              </ul>
            </div>

            <div className="mt-8 text-[11px] text-ink/50 normal-case tracking-normal leading-relaxed">
              <p>{footerContent.transitNote}</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[11px] text-ink/50">
          <p className="max-w-xl leading-relaxed">
            {footerContent.disclaimer}
          </p>
          <p className="font-mono tracking-wider">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
