'use client';

import React from 'react';
import { SiteData } from '../lib/site-data';
import TelemetryTerminal from './TelemetryTerminal';

interface AboutProps {
  siteData: SiteData;
}

export default function About({ siteData }: AboutProps) {
  const { about } = siteData;

  return (
    <section
      id="about"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-8 md:px-[4.5vw] bg-[#050505] border-b border-[rgba(255,255,255,0.15)] overflow-hidden"
    >
      {/* Background Watermark */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 font-display text-[20vw] font-black text-[rgba(255,255,255,0.02)] select-none pointer-events-none uppercase leading-none">
        AVANT
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 bg-[#FFE600]" />
          <span className="font-mono text-xs sm:text-sm font-bold text-[#FFE600] uppercase tracking-widest">
            [ {about.eyebrow} ]
          </span>
        </div>

        {/* 2-Column Main Section (Left Narrative / Right Telemetry Terminal) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          {/* Left Column (7 cols): Massive Condensed Headline & Philosophy Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[0.92] tracking-tight uppercase text-[#FFFFFF]">
              {about.headline}
            </h2>

            <p className="font-sans text-base sm:text-lg text-[rgba(255,255,255,0.8)] leading-relaxed max-w-[62ch]">
              {about.bio}
            </p>

            <div className="pt-4 flex items-center gap-6 font-mono text-xs text-[rgba(255,255,255,0.6)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
                <span>FAULT TOLERANT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFE600]" />
                <span>SUB-MS JITTER</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                <span>EDGE-NATIVE</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Live Telemetry Terminal */}
          <div className="lg:col-span-5">
            <TelemetryTerminal siteData={siteData} />
          </div>
        </div>

        {/* Bottom 4-Column Stat Blocks with High Architectural Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[rgba(255,255,255,0.15)]">
          {about.stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-[#0C0D10] border-l-2 border-[#FFE600] flex flex-col justify-between hover:bg-[rgba(255,230,0,0.05)] transition-colors"
            >
              <div>
                <span className="font-display font-black text-5xl sm:text-6xl text-[#FFE600] block mb-2 leading-none">
                  {stat.value}
                </span>
                <span className="font-mono text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">
                  {stat.label}
                </span>
              </div>
              {stat.detail && (
                <p className="font-sans text-xs text-[rgba(255,255,255,0.6)] mt-2">
                  {stat.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
