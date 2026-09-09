"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { clinicInfo, heroContent } from "@/data/content";

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen bg-bone pt-28 sm:pt-36 pb-16 sm:pb-24 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 sm:mb-8"
            >
              <span className="text-[11px] uppercase tracking-ultra font-medium text-ink/60 border-l border-clay pl-3">
                {heroContent.eyebrow}
              </span>
            </motion.div>

            {/* Large Headline: lines appear individually through masks */}
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-light tracking-tightest text-ink uppercase leading-[0.92] mb-6 sm:mb-8">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="block"
                >
                  {heroContent.headlineLine1}
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                  className="block text-ink"
                >
                  {heroContent.headlineLine2}
                </motion.span>
              </span>
            </h1>

            {/* Serif Underline: arrives separately */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="text-xl sm:text-2xl text-ink/90 mb-6 sm:mb-8 font-light leading-snug"
            >
              <span>{heroContent.subheadingPrefix}</span>
              <span className="font-serif italic font-normal text-2xl sm:text-3xl text-ink">
                {heroContent.subheadingSerif}
              </span>
            </motion.p>

            {/* Small copy */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
              className="text-sm sm:text-base text-ink-muted max-w-lg leading-relaxed mb-10 font-normal"
            >
              {heroContent.copy}
            </motion.p>

            {/* CTA row: appears last */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
              className="flex flex-wrap items-center gap-6 sm:gap-10"
            >
              <button
                onClick={onBookClick}
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-bone hover:bg-ink/90 text-xs uppercase tracking-widest font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-bone"
              >
                <span>{heroContent.cta.replace(" →", "")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href={`tel:${clinicInfo.phoneRaw}`}
                className="text-xs uppercase tracking-widest text-ink/70 hover:text-ink transition-colors border-b border-stone/60 pb-0.5"
              >
                {heroContent.secondaryPhone}
              </a>
            </motion.div>
          </div>

          {/* Right Column: Sculptural Photograph + Vertical Label */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            {/* Tiny vertical label: EST. IN CHICAGO */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="hidden sm:block absolute -left-10 lg:-left-12 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <span
                className="text-[10px] tracking-ultra uppercase text-ink/40 font-medium whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {heroContent.verticalBadge}
              </span>
            </motion.div>

            {/* Sculptural Photo Crop: One large curved corner, completely square on another */}
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] overflow-hidden rounded-tr-[100px] sm:rounded-tr-[140px] rounded-bl-[40px] rounded-tl-none rounded-br-none bg-stone/20 shadow-[0_20px_40px_rgba(30,33,31,0.06)]">
              <motion.div
                initial={{ y: "18%", scale: 1.08 }}
                animate={{ y: "0%", scale: 1 }}
                transition={{
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src={heroContent.image}
                  alt={heroContent.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-center filter grayscale-[18%] contrast-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bone/30 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
