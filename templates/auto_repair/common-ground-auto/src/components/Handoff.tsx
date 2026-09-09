"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { handoffContent } from "@/data/content";

export default function Handoff() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [daylightProgress, setDaylightProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start transition when top of section enters 80% of window
      // Complete transition when section is centered
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.15;
      const total = start - end;
      const current = start - rect.top;

      const progress = Math.max(0, Math.min(1, current / total));
      setDaylightProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] lg:min-h-screen bg-asphalt text-road-white flex items-center justify-center overflow-hidden select-none border-b border-white/10"
      aria-label="The Handoff: Repaired and back on the road"
    >
      {/* Background Image Layer 1: Garage Lighting (dim, roll-up door) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={handoffContent.garageImage}
          alt={handoffContent.garageAlt}
          fill
          className="object-cover object-center brightness-75"
          sizes="100vw"
        />
      </div>

      {/* Background Image Layer 2: Clear Denver Daylight (cross-fades on scroll) */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 ease-out will-change-opacity"
        style={{ opacity: daylightProgress }}
      >
        <Image
          src={handoffContent.daylightImage}
          alt={handoffContent.daylightAlt}
          fill
          className="object-cover object-center brightness-90"
          sizes="100vw"
        />
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-asphalt via-asphalt/40 to-asphalt/80" />
      <div className="absolute inset-0 z-1 bg-black/30" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-road-white/80 bg-black/60 px-3 py-1 border border-white/15 mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>{handoffContent.step}</span>
        </div>

        <div className="space-y-4">
          <div className="font-display text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            {handoffContent.headline}
          </div>

          <div
            className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-pale-gray transition-all duration-500"
            style={{
              opacity: Math.max(0.4, daylightProgress),
              transform: `translateY(${(1 - daylightProgress) * 10}px)`,
            }}
          >
            {handoffContent.subHeadline}
          </div>

          {/* Cormorant Garamond Subtle Serif Moment */}
          <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-road-white/95 pt-4 tracking-wide">
            {handoffContent.serifText}
          </p>
        </div>
      </div>
    </section>
  );
}
