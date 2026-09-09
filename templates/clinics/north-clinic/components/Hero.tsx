"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { heroContent } from "@/data/content";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-ivory pt-24 md:pt-0 flex flex-col justify-center overflow-hidden border-b border-dust">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[92vh] sm:min-h-screen">
        {/* Left Side: Large Warm Ivory Field (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-24 lg:py-28 z-10 order-2 lg:order-1">
          {/* Top Label */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-ink/50 font-sans font-medium"
            >
              {heroContent.locationLabel}
            </motion.p>
          </div>

          {/* Main Headline Group */}
          <div className="my-auto py-10 lg:py-0 max-w-xl">
            {/* Primary Headline masked reveal */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[-0.03em] leading-[1.08] text-ink uppercase font-sans"
              >
                {heroContent.headlineLine1} <br className="hidden sm:inline" />
                {heroContent.headlineLine2}
              </motion.h1>
            </div>

            {/* Serif line appearing afterward */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
              className="mt-6 text-2xl sm:text-3xl md:text-4xl font-serif italic text-sage font-normal leading-relaxed"
            >
              {heroContent.serifLine}
            </motion.p>

            {/* Supporting paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.2 }}
              className="mt-6 text-base sm:text-lg text-ink/75 font-sans leading-relaxed max-w-md"
            >
              {heroContent.paragraph}
            </motion.p>

            {/* CTA Group arriving last */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.45 }}
              className="mt-10 sm:mt-12 flex flex-wrap items-center gap-6 sm:gap-8"
            >
              <button
                onClick={onOpenBooking}
                type="button"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-white hover:bg-sage text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-sage"
              >
                <span>{heroContent.primaryCta}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <a
                href="#approach"
                className="text-xs uppercase tracking-[0.2em] text-ink/70 hover:text-ink font-medium py-2 transition-colors relative group"
              >
                <span>{heroContent.secondaryCta}</span>
                <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-ink group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.6 }}
            className="pt-6 border-t border-dust/60 flex flex-wrap items-center justify-between gap-4 text-[11px] sm:text-xs text-ink/60 tracking-[0.15em] uppercase font-sans"
          >
            <span>{heroContent.hoursText}</span>
            <span>{heroContent.locationText}</span>
          </motion.div>
        </div>

        {/* Right Side: Full-height photograph of a calm clinic interior (5 cols on desktop) */}
        <div className="lg:col-span-5 relative w-full h-[52vh] sm:h-[60vh] lg:h-auto min-h-full overflow-hidden order-1 lg:order-2 bg-dust-light">
          <motion.div
            initial={{ scale: 1.08, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full min-h-[50vh] lg:min-h-full"
          >
            <Image
              src={heroContent.image}
              alt={heroContent.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
            {/* Subtle soft daylight film overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ivory/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ivory/20 lg:to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
