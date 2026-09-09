"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { eveningCtaContent, clinicInfo } from "@/data/content";

interface EveningCtaProps {
  onOpenBooking: () => void;
}

export default function EveningCta({ onOpenBooking }: EveningCtaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-15% 0px" });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] bg-[#202321] text-white overflow-hidden flex items-center justify-center py-28 md:py-36"
    >
      {/* Background Exterior Dusk Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src={eveningCtaContent.image}
          alt={eveningCtaContent.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center filter brightness-90 contrast-105"
        />
        {/* Deep Ink Veil for Readability */}
        <div className="absolute inset-0 bg-[#202321]/65 backdrop-brightness-90" />
      </div>

      {/* Subtle Sequential Window Illumination Effect */}
      {/* Window 1: Left timber door & window alcove */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.65 : 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        className="absolute top-[28%] left-[12%] w-[22%] h-[48%] rounded-sm bg-gradient-to-b from-[#FFAE5C]/35 via-[#FFD384]/20 to-transparent blur-2xl pointer-events-none mix-blend-screen"
      />

      {/* Window 2: Center consultation bay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.8 : 0 }}
        transition={{ duration: 1.6, delay: 1.0, ease: "easeOut" }}
        className="absolute top-[22%] left-[36%] w-[28%] h-[56%] rounded-sm bg-gradient-to-b from-[#FFB86C]/40 via-[#FFE19F]/25 to-transparent blur-3xl pointer-events-none mix-blend-screen"
      />

      {/* Window 3: Right side evening light */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.7 : 0 }}
        transition={{ duration: 1.5, delay: 1.7, ease: "easeOut" }}
        className="absolute top-[26%] right-[14%] w-[25%] h-[50%] rounded-sm bg-gradient-to-b from-[#FFA54A]/35 via-[#FFC570]/20 to-transparent blur-2xl pointer-events-none mix-blend-screen"
      />

      {/* Center Content Field */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center">
        {/* Subtle Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sage-light animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 font-sans">
            {eveningCtaContent.indicator}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 16 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] uppercase text-white font-sans"
        >
          {eveningCtaContent.headline}
        </motion.h2>

        {/* Serif Companion */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 12 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-4 text-2xl sm:text-3xl md:text-4xl font-serif italic text-white/90 font-normal leading-relaxed"
        >
          {eveningCtaContent.serifText}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 sm:mt-12"
        >
          <button
            onClick={onOpenBooking}
            type="button"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ink hover:bg-sage hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>{eveningCtaContent.ctaText}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        {/* Direct Contact Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xs uppercase tracking-[0.18em] text-white/75 font-sans"
        >
          <a
            href={clinicInfo.phoneTel}
            className="hover:text-white transition-colors"
          >
            {eveningCtaContent.phone}
          </a>
          <span className="hidden sm:inline text-white/30">·</span>
          <span>{eveningCtaContent.address}</span>
        </motion.div>
      </div>
    </section>
  );
}
