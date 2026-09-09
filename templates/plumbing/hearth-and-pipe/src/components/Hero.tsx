"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { businessInfo, heroContent } from "@/data/content";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 bg-[#FAFAF7] overflow-hidden">
      {/* Background Architectural Atmosphere: Quiet Bathroom in Early Morning Light */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0.65, filter: "brightness(0.92) contrast(0.95)" }}
          animate={{ opacity: 0.95, filter: "brightness(1.03) contrast(1.0)" }}
          transition={{ duration: 2.8, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={heroContent.image.src}
            alt={heroContent.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-[60%_35%] opacity-40 md:opacity-45 mix-blend-multiply"
          />
          {/* Subtle warm morning light wash gradient preserving massive negative space on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF7] via-[#FAFAF7]/85 to-transparent md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent h-48 bottom-0" />
        </motion.div>

        {/* Tactile Morning Steam Drift Overlays */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#E9E7E1]/40 blur-3xl animate-steam-slow pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-[#A8C7C8]/20 blur-3xl animate-steam-delayed pointer-events-none" />
      </div>

      {/* Hero Content — Editorial Layout with Large Negative Space */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
        <div className="max-w-3xl">
          {/* Small architectural label */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-3 mb-8"
          >
            <span className="w-6 h-[1px] bg-[#A86F4F]" />
            <span className="text-[11px] md:text-[12px] tracking-[0.28em] uppercase font-semibold text-[#242522]/70">
              {heroContent.label}
            </span>
          </motion.div>

          {/* Main Headline revealed line-by-line */}
          <div className="space-y-1 md:space-y-2 mb-8">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-[-0.03em] font-normal leading-[0.95] text-[#242522]"
              >
                {heroContent.headlinePart1}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-[-0.03em] font-normal leading-[0.95] text-[#242522]"
              >
                {heroContent.headlinePart2}
              </motion.h1>
            </div>

            <div className="pt-4 md:pt-6 overflow-hidden">
              <motion.p
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#242522]/90 leading-tight"
              >
                {heroContent.headlinePart3Prefix}{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.1, delay: 1.1 }}
                  className="font-serif italic font-normal text-[#A86F4F] tracking-normal"
                >
                  {heroContent.headlinePart3Italic}
                </motion.span>
              </motion.p>
            </div>
          </div>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="text-base sm:text-lg md:text-xl text-[#242522]/75 max-w-xl font-normal leading-relaxed mb-10"
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Group: Arrives last */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center space-x-3 text-[12px] tracking-[0.24em] uppercase font-semibold text-[#FAFAF7] bg-[#242522] hover:bg-[#A86F4F] px-8 py-4 transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              <span>{heroContent.primaryCta}</span>
              <span className="text-[#A8C7C8] font-mono">→</span>
            </button>

            <a
              href={`tel:${heroContent.phoneTel}`}
              className="text-[13px] tracking-[0.16em] text-[#242522] font-mono hover:text-[#A86F4F] transition-colors py-2 border-b border-transparent hover:border-[#A86F4F]"
            >
              {heroContent.phoneCall}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Tiny Caption near bottom */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 flex items-center justify-between border-t border-[#D4D0C7]/60">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
          className="flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.28em] font-mono uppercase text-[#242522]/50"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A8C7C8]" />
          <span>{heroContent.captionLeft}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.1 }}
          className="hidden sm:block text-[10px] tracking-[0.24em] uppercase font-mono text-[#242522]/40"
        >
          {heroContent.captionRight}
        </motion.div>
      </div>
    </section>
  );
}
