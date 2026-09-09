"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { roomContent } from "@/data/content";

export default function TheRoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Staggered reveal of pinned notes
  const note1Opacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const note1Y = useTransform(scrollYProgress, [0.15, 0.35], [20, 0]);

  const note2Opacity = useTransform(scrollYProgress, [0.22, 0.42], [0, 1]);
  const note2Y = useTransform(scrollYProgress, [0.22, 0.42], [20, 0]);

  const note3Opacity = useTransform(scrollYProgress, [0.28, 0.48], [0, 1]);
  const note3Y = useTransform(scrollYProgress, [0.28, 0.48], [20, 0]);

  const note4Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const note4Y = useTransform(scrollYProgress, [0.35, 0.55], [20, 0]);

  // Big headline appearance
  const headlineOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);

  // Image warmth progression as scroll deepens
  const warmthOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 0.35]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] sm:min-h-[140vh] w-full bg-[#171514] overflow-hidden"
    >
      {/* Sticky full-bleed viewport photograph container */}
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden">
        {/* Full-bleed dining room photograph */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={roomContent.image.src}
            alt={roomContent.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.82] contrast-[1.08] filter"
          />

          {/* Vignette & ambient darkness */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171514] via-black/35 to-[#171514]/70" />

          {/* Warmth progression layer (becomes warmer as scroll progresses) */}
          <motion.div
            style={{ opacity: warmthOpacity }}
            className="absolute inset-0 bg-gradient-to-tr from-[#702F35]/50 via-[#E6C875]/25 to-transparent mix-blend-color-burn pointer-events-none"
          />
        </div>

        {/* Pinned notes around the room — like handwritten scraps/tape, NOT UI cards */}
        {/* Note 1: Top-Left */}
        <motion.div
          style={{ opacity: note1Opacity, y: note1Y }}
          className="absolute top-20 sm:top-24 left-4 sm:left-12 rotate-[-2.5deg] z-20"
        >
          <div className="bg-[#E9E2D4] text-[#171514] px-3.5 py-1.5 shadow-xl border-l-2 border-[#702F35]">
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
              {roomContent.pinnedNotes[0].label}
            </span>
          </div>
        </motion.div>

        {/* Note 2: Top-Right */}
        <motion.div
          style={{ opacity: note2Opacity, y: note2Y }}
          className="absolute top-24 sm:top-28 right-4 sm:right-14 rotate-[3.5deg] z-20"
        >
          <div className="bg-[#E9E2D4] text-[#171514] px-3 py-1 shadow-xl border-t border-[#171514]/30">
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
              {roomContent.pinnedNotes[1].label}
            </span>
          </div>
        </motion.div>

        {/* Note 3: Bottom-Left */}
        <motion.div
          style={{ opacity: note3Opacity, y: note3Y }}
          className="absolute bottom-28 sm:bottom-24 left-4 sm:left-16 rotate-[2deg] z-20"
        >
          <div className="bg-[#F7F2E8] text-[#702F35] px-3.5 py-1.5 shadow-xl border-b-2 border-[#171514]">
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] font-semibold uppercase">
              {roomContent.pinnedNotes[2].label}
            </span>
          </div>
        </motion.div>

        {/* Note 4: Bottom-Right */}
        <motion.div
          style={{ opacity: note4Opacity, y: note4Y }}
          className="absolute bottom-24 sm:bottom-20 right-4 sm:right-12 rotate-[-3deg] z-20 max-w-[200px]"
        >
          <div className="bg-[#E9E2D4] text-[#171514] px-3.5 py-2 shadow-xl border-r-2 border-[#702F35]">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.16em] font-semibold uppercase leading-tight block">
              {roomContent.pinnedNotes[3].label}
            </span>
          </div>
        </motion.div>

        {/* Centerpiece Headline */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="relative z-30 text-center px-4 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight uppercase text-[#F7F2E8] leading-[0.95] drop-shadow-md">
            {roomContent.headline.first}
          </h2>
          <span className="block mt-2 sm:mt-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-[#E6C875] tracking-tight leading-[0.95] drop-shadow-lg">
            {roomContent.headline.second}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
