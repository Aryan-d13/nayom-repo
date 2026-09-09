"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Phone, Sun, Moon } from "lucide-react";
import { finalLightsOnContent, businessInfo } from "@/data/content";

interface FinalLightsOnProps {
  onOpenBooking: () => void;
}

export default function FinalLightsOn({ onOpenBooking }: FinalLightsOnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.35 });
  
  // Stages: 0 (dark) -> 1 (kitchen) -> 2 (living) -> 3 (hallway) -> 4 (porch/whole home lit)
  const [lightLevel, setLightLevel] = useState<number>(0);

  useEffect(() => {
    if (!isInView) {
      setLightLevel(0);
      return;
    }

    // Sequentially turn on the rooms when scrolled into view
    const timers = [
      setTimeout(() => setLightLevel(1), 400),
      setTimeout(() => setLightLevel(2), 1000),
      setTimeout(() => setLightLevel(3), 1600),
      setTimeout(() => setLightLevel(4), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-between items-center text-center bg-[#0C0C0A] text-[#FFFFFF] py-20 px-6 sm:px-8 overflow-hidden select-none"
    >
      {/* Background Layer 1: Dark House at Night */}
      <div className="absolute inset-0 z-0">
        <Image
          src={finalLightsOnContent.darkImage}
          alt={finalLightsOnContent.darkImageAlt}
          fill
          className="object-cover object-center brightness-75 transition-opacity duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0C0C0A]/70" />
      </div>

      {/* Background Layer 2: Fully Warmly Illuminated Home (Fades in dynamically) */}
      <div
        className="absolute inset-0 z-1 transition-opacity duration-1000 ease-out pointer-events-none"
        style={{ opacity: lightLevel === 4 ? 0.95 : lightLevel * 0.22 }}
      >
        <Image
          src={finalLightsOnContent.litImage}
          alt={finalLightsOnContent.litImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Warm golden light overlay to mimic dimmer saturation */}
        <div
          className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-[#0C0C0A]/60 transition-opacity duration-1000"
          style={{ opacity: lightLevel >= 3 ? 1 : 0 }}
        />
      </div>

      {/* Dark Vignette to keep text crystal clear */}
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#0C0C0A] via-[#0C0C0A]/40 to-[#0C0C0A]/80 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pt-10">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#161613]/80 border border-[#2B2B24] backdrop-blur-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              lightLevel >= 4 ? "bg-[#BDF45B] indicator-pulse" : "bg-[#55554E]"
            }`}
          />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#C9C6BD] uppercase">
            {finalLightsOnContent.stages[lightLevel] || finalLightsOnContent.stages[0]}
          </span>
        </div>
      </div>

      {/* Center Climax Statement */}
      <div className="relative z-10 max-w-3xl my-auto py-12">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#FFFFFF] leading-[1.08] mb-4"
        >
          {finalLightsOnContent.headline}
        </motion.h2>

        <p className="text-sm sm:text-base tracking-[0.2em] font-mono text-[#C9C6BD] uppercase mb-8">
          {finalLightsOnContent.subheadline}
        </p>

        {/* Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 pt-4">
          <button
            onClick={onOpenBooking}
            className="cta-sweep group inline-flex items-center gap-2.5 px-8 py-4 bg-[#FFFFFF] text-[#11110F] text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#F3F0E8] shadow-lg"
          >
            <span>{finalLightsOnContent.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <a
            href={businessInfo.phoneTel}
            className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold tracking-wide text-[#FFFFFF] hover:text-[#BDF45B] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#BDF45B]" />
            <span>{finalLightsOnContent.ctaPhone}</span>
          </a>
        </div>
      </div>

      {/* Interactive Dimmer / Light Switch Controls at Bottom */}
      <div className="relative z-10 pb-6">
        <div className="flex items-center gap-3 bg-[#161613]/90 px-4 py-2 border border-[#2B2B24] backdrop-blur-xs text-xs text-[#8E8E84]">
          <Moon className="w-3.5 h-3.5" />
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={lightLevel}
            onChange={(e) => setLightLevel(Number(e.target.value))}
            className="w-28 sm:w-40 accent-[#BDF45B] cursor-pointer"
            aria-label="House lighting dimmer"
          />
          <Sun className="w-3.5 h-3.5 text-[#BDF45B]" />
          <span className="font-mono text-[10px] text-[#C9C6BD]">
            {Math.round((lightLevel / 4) * 100)}{finalLightsOnContent.dimmerSuffix}
          </span>
        </div>
      </div>
    </section>
  );
}
