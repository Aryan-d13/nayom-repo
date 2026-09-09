"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FIRM_INFO, heroContent } from "@/data/content";
import { RedUnderline, HandwrittenAnnotation } from "./ui/RedAnnotation";

interface HeroSectionProps {
  onOpenContact: () => void;
}

export function HeroSection({ onOpenContact }: HeroSectionProps) {
  const scrollToPractice = () => {
    const el = document.getElementById("practice");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-28 md:pt-36 pb-16 md:pb-24 paper-texture overflow-hidden flex items-center">
      {/* Background document margin markers */}
      <div className="absolute top-0 bottom-0 left-6 md:left-12 w-[1px] bg-[#171817]/8 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-6 md:right-12 w-[1px] bg-[#171817]/8 pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Document Markup */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            {/* Tiny Label */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="inline-block w-2 h-2 bg-[#9C3C35] rounded-full" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555650]">
                {heroContent.eyebrow}
              </span>
            </motion.div>

            {/* Headline with uncovering sheet animation */}
            <div className="relative mb-6">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.25,
                  }}
                  className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#171817] leading-[1.06]"
                >
                  {heroContent.headline}
                </motion.h1>
              </div>

              {/* Thin red line drawing beneath headline */}
              <div className="w-full mt-2 -mb-2">
                <RedUnderline delay={0.8} />
              </div>

              {/* Tiny red handwritten-looking mark: 'read carefully' */}
              <div className="absolute -top-6 right-2 sm:right-12">
                <HandwrittenAnnotation
                  text={heroContent.annotationText}
                  delay={1.3}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Serif phrase */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="font-serif italic text-2xl sm:text-3xl text-[#171817]/90 font-normal mt-4 mb-4 tracking-tight leading-snug"
            >
              {FIRM_INFO.subTagline}
            </motion.p>

            {/* Supporting copy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="font-sans text-base sm:text-lg text-[#555650] max-w-xl leading-relaxed mb-8"
            >
              {FIRM_INFO.heroSupporting}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.25 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
            >
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#171817] text-[#FCFBF7] hover:bg-[#9C3C35] transition-all duration-300 font-mono text-xs uppercase tracking-widest font-medium group"
              >
                <span>{FIRM_INFO.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={scrollToPractice}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#171817]/25 text-[#171817] hover:border-[#171817] hover:bg-[#FCFBF7] transition-all duration-300 font-mono text-xs uppercase tracking-widest font-medium"
              >
                <span>{FIRM_INFO.secondaryCta}</span>
              </button>
            </motion.div>

            {/* Marginal notation at bottom */}
            <div className="mt-12 pt-6 border-t border-[#171817]/10 flex items-center justify-between text-[#555650] font-mono text-[11px]">
              <span>{heroContent.bottomMarginLeft}</span>
              <span className="hidden sm:inline">{heroContent.bottomMarginRight}</span>
            </div>
          </div>

          {/* Right Column: Candid Editorial Photograph */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
              className="relative"
            >
              {/* Photo Frame with subtle document border and corner ticks */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#D8D4CA] shadow-lg border border-[#171817]/15">
                <Image
                  src={heroContent.image.src}
                  alt={heroContent.image.alt}
                  fill
                  priority
                  className="object-cover object-center filter grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />

                {/* Subtle vignette / paper overlay effect */}
                <div className="absolute inset-0 bg-[#F1EEE7]/10 mix-blend-multiply pointer-events-none" />


              </div>

              {/* Editorial document margin callout below image */}
              <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-[#555650] uppercase tracking-wider">
                <span>{heroContent.image.location}</span>
                <span>{heroContent.image.docRef}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
