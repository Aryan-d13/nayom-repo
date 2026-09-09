"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { heroContent, businessInfo } from "@/data/content";

interface HeroSectionProps {
  onOpenQuote: (service?: string) => void;
}

export default function HeroSection({ onOpenQuote }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#111311] text-[#F5F1E8]">
      {/* Background Architectural Canvas */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Contrast Scrims for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111311]/95 via-[#111311]/70 to-[#111311]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111311] via-transparent to-[#111311]/60 pointer-events-none" />
      </div>

      {/* Hero Headline & Content */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-32 pb-20 sm:pt-40 sm:pb-28 flex flex-col justify-between min-h-screen">
        <div className="max-w-2xl mt-auto sm:mt-16">
          {/* Small serif line */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif italic text-lg sm:text-2xl text-[#D4D0C7] mb-3 tracking-wide"
          >
            {heroContent.italicPretitle}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#F5F1E8] tracking-tight leading-[1.08] mb-6 drop-shadow-md"
          >
            {heroContent.headingPart1} <br />
            <span className="font-normal">{heroContent.headingPart2}</span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg text-[#D4D0C7] max-w-lg leading-relaxed font-sans mb-8"
          >
            {heroContent.description}
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <button
              onClick={() => onOpenQuote("Garage Door Replacement")}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#A85F45] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45]/90 transition-all duration-200 shadow-lg group"
            >
              <span>{heroContent.primaryCta}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#doors"
              className="inline-flex items-center px-7 py-3.5 border border-[#F5F1E8]/50 text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#F5F1E8] hover:text-[#111311] transition-all duration-200"
            >
              {heroContent.secondaryCta}
            </a>
          </motion.div>
        </div>

        {/* Bottom Label */}
        <div className="mt-auto pt-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-white/15">
          <div>
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#D4D0C7]">
              {heroContent.bottomTag}
            </p>
            <p className="text-xs text-[#D4D0C7]/70 mt-0.5">
              {heroContent.bottomSubtitle}
            </p>
          </div>

          <div className="text-xs font-mono text-[#D4D0C7]/70 tracking-widest uppercase">
            {businessInfo.name} • {businessInfo.phone}
          </div>
        </div>
      </div>
    </section>
  );
}
