"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { footerContent, businessInfo } from "@/data/content";

interface FooterProps {
  onOpenQuote: (service?: string) => void;
}

export default function Footer({ onOpenQuote }: FooterProps) {
  return (
    <footer className="w-full bg-[#F5F1E8] text-[#202321] border-t border-[#D4D0C7] pt-20 pb-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#D4D0C7]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-3xl font-medium tracking-tight text-[#202321]">
              {footerContent.brand}
            </h3>
            <p className="font-serif text-lg text-[#53645A] italic">
              {footerContent.tagline}
            </p>
            <p className="text-xs text-[#202321]/70 font-sans max-w-sm leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Services Col */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#A85F45] font-semibold">
              {footerContent.servicesTitle}
            </p>
            <ul className="space-y-2 text-sm text-[#202321]/80 font-sans">
              {footerContent.services.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onOpenQuote(item.service)}
                    className="hover:text-[#A85F45] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#A85F45] font-semibold">
              {footerContent.linksTitle}
            </p>
            <ul className="space-y-2 text-sm text-[#202321]/80 font-sans">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  {"href" in link && link.href ? (
                    <a href={link.href} className="hover:text-[#A85F45] transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => onOpenQuote()}
                      className="hover:text-[#A85F45] transition-colors text-left inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 text-[#A85F45]" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#A85F45] font-semibold">
              {footerContent.contactTitle}
            </p>
            <div className="space-y-2 text-sm text-[#202321]/85 font-sans">
              <p>
                <a
                  href={`tel:${businessInfo.phoneTel}`}
                  className="hover:text-[#A85F45] transition-colors font-medium"
                >
                  {businessInfo.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="hover:text-[#A85F45] transition-colors"
                >
                  {businessInfo.email}
                </a>
              </p>
              <p className="text-xs text-[#53645A] font-mono">
                {businessInfo.fullLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#202321]/55 gap-4">
          <p>{footerContent.copyright}</p>
          <p className="tracking-wider">{footerContent.cityTag}</p>
        </div>
      </div>
    </footer>
  );
}
