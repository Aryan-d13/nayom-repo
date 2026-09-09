"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY, finalCtaContent } from "@/data/content";

interface FinalCtaProps {
  onOpenBooking: () => void;
}

export function FinalCta({ onOpenBooking }: FinalCtaProps) {
  const [lineCompleted, setLineCompleted] = useState(false);

  return (
    <section className="relative bg-[#F4F0E7] text-[#15212A] py-24 sm:py-32 md:py-40 overflow-hidden border-t border-[#15212A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Warm Home Photography */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-4/3 sm:aspect-square w-full rounded-none overflow-hidden border border-[#15212A]/15 bg-[#E8DFD0] shadow-xl">
              <Image
                src={finalCtaContent.image.src}
                alt={finalCtaContent.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 550px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#15212A]/20 via-transparent to-white/10 pointer-events-none" />
            </div>

            {/* Sub-label */}
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#15212A]/60">
              <span>{finalCtaContent.image.captionLeft}</span>
              <span>{finalCtaContent.image.captionRight}</span>
            </div>
          </div>

          {/* Right Column: Emotional Closing Typography & Loop-Closing Flow Line */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-4 font-medium">
              {finalCtaContent.sectionNumber}
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#15212A] leading-[1.05] mb-4">
              {finalCtaContent.headlineLine1} <br />
              {finalCtaContent.headlineLine2}
            </h2>

            {/* Small Serif Line: That's really all anyone wants. */}
            <p className="font-serif italic text-2xl sm:text-3xl text-[#397A91] mb-5">
              {finalCtaContent.serifLine}
            </p>

            <p className="text-base sm:text-lg text-[#15212A]/80 font-normal leading-relaxed max-w-lg mb-8">
              {finalCtaContent.description}
            </p>

            {/* The Reappearing Blue Flow Line Closing the Visual Loop */}
            <div className="relative w-full h-10 mb-6 pointer-events-none overflow-visible">
              <svg
                viewBox="0 0 600 36"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M 10 18 C 140 6, 280 30, 460 18"
                  stroke="#397A91"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.85 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => setLineCompleted(true)}
                />
              </svg>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={onOpenBooking}
                className="group relative overflow-hidden bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] px-7 py-4 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-3 cursor-pointer shadow-sm"
              >
                <span className="relative z-10">{finalCtaContent.ctaLabel}</span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 text-[#D8E9EA]" />
              </button>

              <a
                href={COMPANY.phoneRaw}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#15212A] hover:text-[#397A91] transition-colors py-3"
              >
                <Phone className="w-4 h-4 text-[#397A91]" />
                <span className="font-mono text-sm sm:text-base">
                  {COMPANY.phone}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
