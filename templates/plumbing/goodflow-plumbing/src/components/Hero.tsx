"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY, heroContent } from "@/data/content";

interface HeroProps {
  onOpenBooking: () => void;
}

export function Hero({ onOpenBooking }: HeroProps) {
  const [lineDrawn, setLineDrawn] = useState(false);

  return (
    <section className="relative min-h-[90vh] lg:min-h-[96dvh] bg-[#F4F0E7] pt-24 pb-16 md:pt-28 md:pb-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            {/* Eyebrow */}
            <div className="overflow-hidden mb-3">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-[11px] sm:text-xs font-mono tracking-widest text-[#397A91] uppercase font-medium"
              >
                {heroContent.eyebrow}
              </motion.span>
            </div>

            {/* Huge Headline: Clipped Line-by-Line Reveal */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-[5.25rem] font-normal tracking-tight text-[#15212A] leading-[0.95] mb-6">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="block"
                >
                  {heroContent.headlineLine1}
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="block text-[#15212A]"
                >
                  {heroContent.headlineLine2}
                </motion.span>
              </div>
            </h1>

            {/* Smaller Serif Sentence (Instrument Serif Italic) */}
            <div className="overflow-hidden mb-5">
              <motion.p
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif italic text-2xl sm:text-3xl text-[#397A91] leading-snug"
              >
                {heroContent.serifSentence}
              </motion.p>
            </div>

            {/* Supporting Copy */}
            <div className="overflow-hidden mb-8 max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-base sm:text-lg text-[#15212A]/80 leading-relaxed font-normal"
              >
                {heroContent.supportingCopy}
              </motion.p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="relative">
              {/* Animated CTA appearing once flow line approaches */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: lineDrawn ? 1 : 0.9, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
              >
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="relative group overflow-hidden bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] px-7 py-4 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xs hover:shadow-md"
                >
                  {/* Subtle highlight sheen */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#D8E9EA]/20 to-transparent pointer-events-none" />
                  <span className="relative z-10">{heroContent.primaryCta}</span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#D8E9EA]" />
                </button>

                <a
                  href={COMPANY.phoneRaw}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#15212A] hover:text-[#397A91] transition-colors py-3"
                >
                  <Phone className="w-4 h-4 text-[#397A91] transition-transform duration-200 group-hover:-rotate-12" />
                  <span className="editorial-link">{heroContent.secondaryCta}</span>
                  <span className="text-[#15212A]/60 font-mono text-xs normal-case ml-1">
                    {COMPANY.phone}
                  </span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Organic / Circular Media Window */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Pale Blue Glow Backing */}
            <div
              className="absolute -inset-4 bg-[#D8E9EA]/40 rounded-full blur-2xl -z-10 pointer-events-none"
              aria-hidden="true"
            />

            {/* Media Mask Container: expands from 92% -> 100% */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] rounded-[42%_58%_60%_40%/46%_48%_52%_54%] overflow-hidden shadow-xl border border-[#15212A]/10 bg-[#E8DFD0]"
            >
              <Image
                src={heroContent.image.src}
                alt={heroContent.image.alt}
                fill
                priority
                className="object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Gentle reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#15212A]/20 via-transparent to-white/20 pointer-events-none" />
            </motion.div>

            {/* Micro Caption */}
            <div className="absolute -bottom-6 right-2 sm:right-6 bg-[#F4F0E7]/90 px-3 py-1 text-[11px] font-mono text-[#15212A]/60 tracking-wider border border-[#15212A]/10">
              {heroContent.image.caption}
            </div>
          </div>
        </div>

        {/* The Signature Flow Line: Starts near faucet and travels downward across the page toward the CTA */}
        <div className="relative w-full mt-6 sm:mt-10 h-10 sm:h-14 pointer-events-none overflow-visible">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pure, clean continuous drawing blue flow line */}
            <motion.path
              d="M 980 8 C 820 12, 580 48, 380 32 C 220 18, 120 38, 40 46"
              stroke="#397A91"
              strokeWidth="1.75"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{
                duration: 2.0,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={() => setLineDrawn(true)}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
