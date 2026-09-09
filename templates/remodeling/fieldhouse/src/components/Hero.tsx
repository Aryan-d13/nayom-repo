"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_CONTENT } from "@/data/content";

interface HeroProps {
  onOpenProjectModal: () => void;
}

export default function Hero({ onOpenProjectModal }: HeroProps) {
  return (
    <section
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex items-center bg-warm-white overflow-hidden"
      aria-label="Fieldhouse Introduction"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left / Editorial Copy Column */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <span className="w-6 h-[1.5px] bg-moss/70" />
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold">
                {HERO_CONTENT.label}
              </span>
            </motion.div>

            {/* Headline: "KEEP THE GOOD PARTS." uncovered from behind image */}
            <div className="relative overflow-hidden mb-6">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1], // bespoke cubic bezier for smooth unmasking
                  delay: 0.15,
                }}
                className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] tracking-tight leading-[0.92] text-ink uppercase"
              >
                {HERO_CONTENT.headlineLines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < HERO_CONTENT.headlineLines.length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>
            </div>

            {/* Large Serif Statement: "Then make the rest work better." */}
            <motion.p
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="font-serif italic text-2xl sm:text-3xl md:text-[2rem] text-ink/90 font-normal leading-tight mb-6"
            >
              {HERO_CONTENT.serifLine}
            </motion.p>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
              className="text-base sm:text-lg text-ink/75 max-w-lg leading-relaxed font-normal mb-10"
            >
              {HERO_CONTENT.supportingCopy}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <button
                onClick={onOpenProjectModal}
                className="px-7 py-4 bg-ink text-warm-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-moss active:scale-[0.98] transition-all duration-200 text-center cursor-pointer shadow-sm hover:shadow"
              >
                {HERO_CONTENT.primaryCTA}
              </button>

              <a
                href="#what-we-keep"
                className="px-6 py-4 border border-ink/30 hover:border-ink text-ink text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 text-center hover:bg-parchment/40"
              >
                {HERO_CONTENT.secondaryCTA}
              </a>
            </motion.div>
          </div>

          {/* Right / Character Home Photograph Column */}
          <div className="lg:col-span-6 relative">
            {/* Soft-edged Crop Entrance Reveal */}
            <motion.div
              initial={{ clipPath: "inset(12% 12% 12% 12% round 16px)", opacity: 0.2, scale: 0.96 }}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, scale: 1 }}
              transition={{
                duration: 1.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative aspect-[4/5] sm:aspect-[4/4.5] md:aspect-[5/5.5] w-full overflow-hidden bg-dust/30 shadow-[0_20px_50px_-20px_rgba(35,35,33,0.18)]"
            >
              <Image
                src={HERO_CONTENT.image}
                alt={HERO_CONTENT.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter saturate-[0.92] contrast-[1.03]"
              />

              {/* Raking natural afternoon light gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/25 via-transparent to-warm-white/10 pointer-events-none" />

              {/* Subtle corner architectural registration mark */}
              <div className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.2em] text-warm-white/80 bg-ink/40 backdrop-blur-xs px-2.5 py-1 font-mono">
                {HERO_CONTENT.cornerBadge}
              </div>
            </motion.div>

            {/* Handwritten Architect Annotation (Arrives Last) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{
                duration: 0.8,
                delay: 1.25, // Arrives last as requested
                ease: "easeOut",
              }}
              className="absolute -bottom-6 -left-3 sm:-bottom-8 sm:left-4 z-20 bg-parchment/95 backdrop-blur-xs border border-dust/80 px-4 py-3 shadow-[0_8px_20px_-6px_rgba(35,35,33,0.15)] flex items-start space-x-3 pointer-events-none"
            >
              {/* Hand-drawn pencil pointer arrow */}
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-terracotta flex-shrink-0 mt-1"
              >
                <path
                  d="M4 28C10 24 18 18 24 6M24 6L16 6M24 6L26 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-line"
                />
              </svg>

              <div className="flex flex-col">
                <span className="font-hand text-xl sm:text-2xl text-ink font-semibold leading-tight whitespace-pre-line tracking-wide">
                  {HERO_CONTENT.architectNote}
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-moss/90 mt-0.5">
                  {HERO_CONTENT.architectNoteTag}
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
