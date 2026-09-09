'use client';

import React from 'react';
import { SiteData } from '../lib/site-data';

interface LogoTickerProps {
  siteData: SiteData;
}

export default function LogoTicker({ siteData }: LogoTickerProps) {
  const { partners } = siteData;

  // Duplicate for seamless 60fps marquee
  const tickerItems = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="relative w-full py-12 sm:py-16 bg-[#050505] border-b border-[rgba(255,255,255,0.15)] bg-dotted-matrix overflow-hidden select-none">
      {/* Top Label */}
      <div className="text-center mb-6">
        <span className="font-mono text-[10px] sm:text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-[0.25em]">
          ✦ DEPLOYED ON & INTEGRATED WITH LEADING PLATFORMS ✦
        </span>
      </div>

      {/* Infinite Horizontal Logo Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Edge Gradient Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 sm:gap-16 whitespace-nowrap will-change-transform animate-marquee">
          {tickerItems.map((partner, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-[rgba(255,255,255,0.35)] hover:text-[#FFE600] transition-colors cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.2)]" />
              <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
