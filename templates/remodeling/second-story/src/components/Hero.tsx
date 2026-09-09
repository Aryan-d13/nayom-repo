"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_CONTENT, BRAND } from "@/data/content";
import { ArrowRight, Eye } from "lucide-react";

interface HeroProps {
  onOpenInquiry: () => void;
}

export default function Hero({ onOpenInquiry }: HeroProps) {
  const [peekAfter, setPeekAfter] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      ref={containerRef}
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-12 bg-chalk overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Editorial Header / Typography */}
        <div className="max-w-4xl mb-12 md:mb-16">
          {/* Small Category line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-terracotta" />
            <span className="font-sans text-xs tracking-[0.24em] uppercase text-ink/70 font-medium">
              {HERO_CONTENT.category}
            </span>
          </motion.div>

          {/* Masked Headline Reveal */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15,
              }}
              className="font-sans font-medium text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.05] text-ink uppercase"
            >
              {HERO_CONTENT.headline}
            </motion.h1>
          </div>

          {/* Serif continuation arrives separately */}
          <div className="overflow-hidden mt-2 mb-6">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.45,
              }}
              className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-terracotta leading-tight"
            >
              {HERO_CONTENT.serifSubhead}
            </motion.div>
          </div>

          {/* Supporting Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-2"
          >
            <p className="max-w-md font-sans text-base md:text-lg text-ink/80 leading-relaxed font-normal">
              {HERO_CONTENT.supportingText}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenInquiry}
                className="group px-6 py-3.5 bg-ink text-chalk text-xs tracking-[0.18em] uppercase font-sans flex items-center gap-3 hover:bg-terracotta transition-all duration-300 shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-terracotta"
              >
                <span>{BRAND.primaryCTA}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#work"
                className="px-5 py-3.5 border border-ink/30 text-ink text-xs tracking-[0.18em] uppercase font-sans hover:border-ink hover:bg-ink/5 transition-all duration-300 focus:outline-hidden focus:ring-1 focus:ring-terracotta"
              >
                {BRAND.secondaryCTA}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Full-width editorial photograph with warming transition and subtle before badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative w-full aspect-[16/10] md:aspect-[21/10] rounded-xs overflow-hidden border border-stone/60 shadow-sm group"
        >
          {/* Base imperfect before image: warms up on mount with subtle parallax */}
          <motion.div
            style={{ y: imageY }}
            initial={{ filter: "grayscale(35%) brightness(0.92) sepia(10%)" }}
            animate={{ filter: "grayscale(0%) brightness(1) sepia(0%)" }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
            className="relative w-full h-[112%] -top-[6%]"
          >
            <Image
              src={peekAfter ? HERO_CONTENT.remodeledImage : HERO_CONTENT.image}
              alt={HERO_CONTENT.imageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-opacity duration-700"
            />
          </motion.div>

          {/* Gentle vignette / architectural grain overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />

          {/* Small translucent BEFORE badge appearing last */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-3 z-10"
          >
            <span className="px-3 py-1.5 bg-ink/75 backdrop-blur-md text-chalk font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase border border-chalk/20 rounded-xs shadow-sm">
              {peekAfter ? HERO_CONTENT.previewBadge : HERO_CONTENT.badge}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-sans text-chalk/80 tracking-wide drop-shadow-xs">
              {HERO_CONTENT.houseMeta}
            </span>
          </motion.div>

          {/* Interactive peek button on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10"
          >
            <button
              onMouseEnter={() => setPeekAfter(true)}
              onMouseLeave={() => setPeekAfter(false)}
              onClick={() => setPeekAfter(!peekAfter)}
              className="px-3.5 py-1.5 bg-chalk/90 hover:bg-chalk text-ink text-[11px] tracking-wider uppercase font-sans flex items-center gap-2 rounded-xs border border-ink/20 shadow-sm transition-all cursor-pointer backdrop-blur-xs"
              title={HERO_CONTENT.peekTooltip}
            >
              <Eye className="w-3.5 h-3.5 text-terracotta" />
              <span>{peekAfter ? HERO_CONTENT.peekActiveLabel : HERO_CONTENT.peekInactiveLabel}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
