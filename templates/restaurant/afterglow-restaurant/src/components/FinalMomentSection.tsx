"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { finalMomentContent } from "@/data/content";

export default function FinalMomentSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Staggered quiet reveal
  const line1Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.35, 0.55], [15, 0]);

  const line2Opacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.55, 0.75], [15, 0]);

  const brandOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const brandY = useTransform(scrollYProgress, [0.75, 0.95], [20, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full bg-[#171514] overflow-hidden flex items-center justify-center text-center"
    >
      {/* Full-bleed late-night quiet dining room photograph */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={finalMomentContent.image.src}
          alt={finalMomentContent.image.alt}
          fill
          sizes="100vw"
          className="object-cover brightness-[0.6] contrast-[1.1] filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171514] via-black/40 to-[#171514]/80" />
      </div>

      {/* Quiet, poetic ending text */}
      <div className="relative z-20 px-6 max-w-xl mx-auto flex flex-col items-center space-y-6">
        {/* Tiny serif text */}
        <motion.div
          style={{ opacity: line1Opacity, y: line1Y }}
          className="space-y-1"
        >
          <p className="font-serif italic text-base sm:text-lg md:text-xl tracking-[0.16em] text-[#B7AEA0] uppercase">
            {finalMomentContent.lines[0]}
          </p>
          <p className="font-serif italic text-base sm:text-lg md:text-xl tracking-[0.16em] text-[#B7AEA0] uppercase">
            {finalMomentContent.lines[1]}
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div style={{ opacity: line2Opacity, y: line2Y }} className="pt-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-[0.25em] text-[#F7F2E8] uppercase">
            {finalMomentContent.heading}
          </h2>
        </motion.div>

        {/* Brand */}
        <motion.div
          style={{ opacity: brandOpacity, y: brandY }}
          className="pt-8 border-t border-[#B7AEA0]/20 w-48 mx-auto"
        >
          <span className="text-lg sm:text-xl font-sans font-bold tracking-[0.35em] text-[#E6C875] uppercase block">
            {finalMomentContent.brand}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#B7AEA0]/50 uppercase mt-1 block">
            {finalMomentContent.address}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
