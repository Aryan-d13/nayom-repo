"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { philosophyContent } from "@/data/content";

export default function BrandPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background image shifts very slightly while typography stays almost still
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  
  // Subtle horizontal drift on supporting lines
  const driftLeft = useTransform(scrollYProgress, [0, 1], ["15px", "-15px"]);
  const driftRight = useTransform(scrollYProgress, [0, 1], ["-15px", "15px"]);

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative min-h-[90vh] flex items-center justify-center bg-[#11110F] text-[#FFFFFF] py-28 md:py-40 overflow-hidden"
    >
      {/* Parallax Background Interior Image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 z-0 scale-105 pointer-events-none opacity-20"
      >
        <Image
          src={philosophyContent.image}
          alt={philosophyContent.imageAlt}
          fill
          className="object-cover object-center filter grayscale contrast-125"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-transparent to-[#11110F]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11110F] via-transparent to-[#11110F]" />
      </motion.div>

      {/* Foreground Typography */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Subtle Brand Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 bg-[#1A1A17] border border-[#2B2B26]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] font-mono uppercase text-[#A0A094]">
            {philosophyContent.eyebrow}
          </span>
        </div>

        {/* Huge Main Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#FFFFFF] leading-[1.08] mb-10 max-w-4xl mx-auto">
          {philosophyContent.headline}
        </h2>

        {/* Horizontal Drifting Lines */}
        <div className="space-y-2.5 sm:space-y-4 mb-14 text-sm sm:text-lg md:text-xl text-[#C9C6BD] font-normal tracking-wide">
          <motion.p style={{ x: driftLeft }} className="transition-transform duration-100 ease-out">
            {philosophyContent.driftLine1}
          </motion.p>
          <motion.p style={{ x: driftRight }} className="transition-transform duration-100 ease-out text-[#E0DDD5]">
            {philosophyContent.driftLine2}
          </motion.p>
        </div>

        {/* Reveal: We care about the part most people never think about */}
        <div className="pt-10 border-t border-[#262621] max-w-xl mx-auto">
          <p className="text-xl sm:text-2xl text-[#E5E2D9] font-serif italic mb-3">
            {philosophyContent.quote}
          </p>
          <p className="text-xs sm:text-sm text-[#7D7D72] leading-relaxed">
            {philosophyContent.description}
          </p>
        </div>
      </div>
    </section>
  );
}
