'use client';

import React from 'react';
import { Crosshair, Cpu, Layers, Radio, Sparkles } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface ExpertiseBentoProps {
  siteData: SiteData;
}

export default function ExpertiseBento({ siteData }: ExpertiseBentoProps) {
  const { services } = siteData;

  const getPatternGraphic = (patternType?: string) => {
    switch (patternType) {
      case 'checker':
        return (
          <div className="w-12 h-12 bg-checker-black border border-[rgba(255,230,0,0.4)]" />
        );
      case 'target':
        return (
          <div className="w-12 h-12 rounded-full border-2 border-[#FFE600] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-[#FFFFFF] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#FFE600] rounded-full" />
            </div>
          </div>
        );
      case 'hazard':
        return (
          <div className="w-12 h-12 bg-hazard-sm border border-[rgba(255,255,255,0.3)]" />
        );
      case 'radar':
      default:
        return (
          <div className="w-12 h-12 rounded-full border border-[#00FF88] flex items-center justify-center relative overflow-hidden">
            <Radio className="w-6 h-6 text-[#00FF88] animate-pulse" />
          </div>
        );
    }
  };

  return (
    <section
      id="expertise"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-8 md:px-[4.5vw] bg-[#FFE600] text-[#050505] border-b-2 border-[#050505] overflow-hidden"
    >
      {/* Subtle Background Hazard Watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-hazard-subtle opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b-2 border-[#050505]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-[#050505]" />
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-widest text-[#050505]">
                [ 02 // CAPABILITIES & ARCHITECTURE ]
              </span>
            </div>
            <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.88] tracking-tight uppercase text-[#050505] m-0">
              CORE EXPERTISE
            </h2>
          </div>

          <p className="font-mono text-xs sm:text-sm text-[#050505] font-bold max-w-md mt-4 md:mt-0 uppercase">
            Four specialized competency vectors engineered for extreme scale, 60fps WebGL execution, and sub-10ms response latency.
          </p>
        </div>

        {/* 4 Floating Bento Cards (Black cards on Cyber Yellow field) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="group relative bg-[#050505] text-[#FFFFFF] border-2 border-[#050505] rounded-media p-8 sm:p-10 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Card Corner Accents */}
              <div className="absolute top-4 right-4 text-[#FFE600] font-mono text-xs font-bold">
                0{index + 1} //
              </div>

              <div>
                {/* Top Category Badge + Pattern Graphic */}
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-[rgba(255,230,0,0.15)] border border-[#FFE600] text-[#FFE600] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-ui">
                    {service.category}
                  </span>
                  {getPatternGraphic(service.patternType)}
                </div>

                {/* Card Title */}
                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase text-[#FFFFFF] group-hover:text-[#FFE600] transition-colors leading-[0.95] mb-4">
                  {service.title}
                </h3>

                {/* Card Description */}
                <p className="font-sans text-sm sm:text-base text-[rgba(255,255,255,0.75)] leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Bottom Tags + Metric Pill */}
              <div className="pt-6 border-t border-[rgba(255,255,255,0.15)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2.5 py-1 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.9)] font-mono text-[11px] uppercase tracking-wide rounded-ui"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {service.metrics && (
                  <span className="font-mono text-xs font-bold text-[#FFE600]">
                    ✦ {service.metrics}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
