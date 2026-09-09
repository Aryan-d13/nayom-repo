'use client';

import React from 'react';
import { ArrowRight, Terminal, Crosshair, Cpu, Activity } from 'lucide-react';
import { SiteData } from '../lib/site-data';
import WireframeCanvas from './WireframeCanvas';

interface HeroProps {
  siteData: SiteData;
  onOpenContact: () => void;
}

export default function Hero({ siteData, onOpenContact }: HeroProps) {
  const { hero, site } = siteData;

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] pt-24 sm:pt-28 pb-12 px-4 sm:px-8 md:px-[4.5vw] bg-[#050505] flex flex-col justify-between overflow-hidden border-b border-[rgba(255,255,255,0.15)]"
    >
      {/* Background Technical Grid Overlay */}
      <div className="absolute inset-0 bg-technical-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-dotted-matrix opacity-40 pointer-events-none" />

      {/* Top Technical Ruler Bar with Sub-millimeter Ticks */}
      <div className="relative z-10 w-full mb-6 select-none">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.2)] font-mono text-[10px] sm:text-xs text-[rgba(255,255,255,0.6)] uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-[#FFE600] font-bold">[ {hero.badge} ]</span>
            <span className="hidden md:inline text-[rgba(255,255,255,0.4)]">
              COORD: {hero.coordinates}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[rgba(255,255,255,0.5)]">
            <span className="hidden sm:inline">REF.SYS: 00-10-20-30-40-50</span>
            <span className="text-[#00FF88] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Scaled Visual Ruler Marks */}
        <div className="w-full flex justify-between pt-1 overflow-hidden opacity-40">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-[1px] bg-white ${
                  i % 5 === 0 ? 'h-3 bg-[#FFE600]' : 'h-1.5 bg-white/40'
                }`}
              />
              {i % 10 === 0 && (
                <span className="font-mono text-[7px] text-white/60 mt-0.5">
                  {i * 10}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Hero Macro-Layout (Asymmetric Split 60/40) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">
        {/* Left Column (60%): Massive Typography + Value Prop + Pill CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Corner Frame Anchor */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 bg-[rgba(255,230,0,0.15)] border border-[#FFE600] text-[#FFE600] font-mono text-[11px] font-bold uppercase tracking-widest">
              {site.niche}
            </span>
          </div>

          {/* Massive Display Headlines (Locked to prevent awkward wrapping) */}
          <div className="relative mb-6">
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[6.2vw] leading-[0.88] tracking-tight uppercase text-[#FFFFFF] m-0">
              <span className="block">{hero.titleLine1}</span>
              <span className="block text-[#FFE600] mt-1">
                {hero.titleLine2}
              </span>
            </h1>
          </div>

          {/* Value Prop Subtext */}
          <p className="font-sans text-base sm:text-lg text-[rgba(255,255,255,0.75)] max-w-[55ch] leading-relaxed mb-8">
            {hero.subtitle}
          </p>

          {/* Tactical Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={hero.ctaPrimaryLink}
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 bg-[#FFE600] text-[#050505] font-display text-xl sm:text-2xl font-black uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-all duration-150 shadow-[0_0_30px_rgba(255,230,0,0.3)]"
            >
              <span>{hero.ctaPrimary}</span>
              <div className="w-10 h-10 rounded-full bg-[#050505] text-[#FFE600] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <button
              onClick={onOpenContact}
              type="button"
              className="inline-flex items-center gap-2.5 px-6 py-4 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] text-[#FFFFFF] hover:text-[#FFE600] font-mono text-xs sm:text-sm uppercase tracking-wider font-bold rounded-pill transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#FFE600]" />
              <span>{hero.ctaSecondary}</span>
            </button>
          </div>
        </div>

        {/* Right Column (40%): 3D Interactive Wireframe Container with Tactical Reticle HUD */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[460px] bg-[#07080B] border border-[rgba(255,255,255,0.15)] rounded-media p-4 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            {/* Tactical Corner Brackets on Wireframe Container */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFE600] z-20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFE600] z-20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFE600] z-20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFE600] z-20 pointer-events-none" />

            {/* Top HUD Telemetry Line */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 font-mono text-[9px] text-[rgba(255,230,0,0.8)] uppercase tracking-wider pointer-events-none select-none">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 text-[#FFE600]" />
                <span>3D.POLYHEDRON.GPU</span>
              </span>
              <span>INTERACTIVE // DRAG TO SPIN</span>
            </div>

            {/* Interactive Canvas */}
            <WireframeCanvas />

            {/* Bottom Status Info in Canvas Box */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-20 font-mono text-[9px] text-[rgba(255,255,255,0.5)] uppercase tracking-wider pointer-events-none select-none">
              <span>RENDER: 60 FPS</span>
              <span className="text-[#FFE600]">KINETIC INERTIA: ON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Metric Strip */}
      <div className="relative z-10 mt-8 pt-6 border-t border-[rgba(255,255,255,0.15)] grid grid-cols-2 md:grid-cols-4 gap-4">
        {hero.metrics.map((metric, i) => (
          <div
            key={i}
            className="flex flex-col p-3 bg-[#0C0D10] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,230,0,0.4)] transition-colors"
          >
            <span className="font-mono text-[9px] sm:text-[10px] text-[rgba(255,255,255,0.5)] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              {i === 0 && <Cpu className="w-3 h-3 text-[#FFE600]" />}
              {i === 1 && <Activity className="w-3 h-3 text-[#00FF88]" />}
              {metric.label}
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-[#FFE600]">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
