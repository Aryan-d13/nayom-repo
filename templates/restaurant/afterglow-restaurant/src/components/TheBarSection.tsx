"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { barContent } from "@/data/content";

interface TheBarSectionProps {
  onOpenDrinks: () => void;
}

export default function TheBarSection({ onOpenDrinks }: TheBarSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Three ingredients drifting vertically at different speeds
  // ICE: moves at speed 1
  const iceY = useTransform(scrollYProgress, [0, 1], [60, -90]);
  // CITRUS: moves at speed 2
  const citrusY = useTransform(scrollYProgress, [0, 1], [130, -140]);
  // WINE: moves at speed 3
  const wineY = useTransform(scrollYProgress, [0, 1], [30, -70]);

  // Typography entering from different directions
  const textLeftX = useTransform(scrollYProgress, [0.15, 0.45], [-60, 0]);
  const textRightX = useTransform(scrollYProgress, [0.18, 0.48], [60, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] sm:min-h-[110vh] w-full bg-[#702F35] text-[#F7F2E8] wine-grain py-24 sm:py-32 px-4 sm:px-8 md:px-16 overflow-hidden flex flex-col justify-center"
    >
      {/* Background drifting ingredients (large cropped photographs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ingredient 1: ICE */}
        <motion.div
          style={{ y: iceY }}
          className="absolute top-[12%] left-[5%] sm:left-[10%] w-44 sm:w-56 md:w-64 aspect-[3/4] z-10"
        >
          <div className="relative w-full h-full p-2 bg-[#572227] border border-[#F7F2E8]/20 shadow-2xl -rotate-6">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={barContent.driftingIngredients[0].src}
                alt={barContent.driftingIngredients[0].alt}
                fill
                sizes="(max-width: 768px) 180px, 260px"
                className="object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-[#702F35]/20 mix-blend-multiply" />
            </div>
            <div className="absolute bottom-2 left-2 bg-[#171514] text-[#E6C875] text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase">
              {barContent.driftingIngredients[0].label}
            </div>
          </div>
        </motion.div>

        {/* Ingredient 2: CITRUS */}
        <motion.div
          style={{ y: citrusY }}
          className="absolute top-[28%] right-[4%] sm:right-[12%] w-48 sm:w-60 md:w-72 aspect-[4/5] z-10"
        >
          <div className="relative w-full h-full p-2 bg-[#572227] border border-[#F7F2E8]/20 shadow-2xl rotate-8">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={barContent.driftingIngredients[1].src}
                alt={barContent.driftingIngredients[1].alt}
                fill
                sizes="(max-width: 768px) 200px, 300px"
                className="object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-[#702F35]/20 mix-blend-multiply" />
            </div>
            <div className="absolute bottom-2 right-2 bg-[#171514] text-[#E6C875] text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase">
              {barContent.driftingIngredients[1].label}
            </div>
          </div>
        </motion.div>

        {/* Ingredient 3: WINE */}
        <motion.div
          style={{ y: wineY }}
          className="absolute bottom-[8%] left-[25%] sm:left-[35%] w-40 sm:w-52 md:w-60 aspect-square z-10"
        >
          <div className="relative w-full h-full p-2 bg-[#572227] border border-[#F7F2E8]/20 shadow-2xl -rotate-3">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={barContent.driftingIngredients[2].src}
                alt={barContent.driftingIngredients[2].alt}
                fill
                sizes="(max-width: 768px) 160px, 240px"
                className="object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-[#702F35]/25 mix-blend-multiply" />
            </div>
            <div className="absolute top-2 right-2 bg-[#171514] text-[#E6C875] text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase">
              {barContent.driftingIngredients[2].label}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Foreground Content with Opposing Direction Typography */}
      <div className="relative z-20 max-w-5xl mx-auto w-full my-auto text-center md:text-left py-12">
        <div className="overflow-hidden">
          <motion.div
            style={{ x: textLeftX, opacity: textOpacity }}
            className="mb-1"
          >
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#E6C875] block mb-2">
              {barContent.badge}
            </span>
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-sans font-black tracking-tight uppercase text-[#F7F2E8] leading-[0.9]">
              {barContent.headline.first}
            </h2>
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            style={{ x: textRightX, opacity: textOpacity }}
            className="md:text-right"
          >
            <h3 className="text-4xl sm:text-7xl md:text-8xl font-serif italic tracking-tight text-[#E6C875] leading-[0.95]">
              {barContent.headline.second}
            </h3>
          </motion.div>
        </div>

        {/* Small text & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 sm:mt-12 max-w-lg md:mx-0 space-y-6"
        >
          <p className="text-base sm:text-lg text-[#F7F2E8]/90 font-sans leading-relaxed">
            {barContent.copy[0]}
            <br />
            {barContent.copy[1]}
            <br />
            {barContent.copy[2]}
          </p>

          <div>
            <button
              onClick={onOpenDrinks}
              className="group inline-flex items-center space-x-3 text-sm tracking-[0.2em] font-mono uppercase text-[#F7F2E8] bg-[#171514] px-6 py-3 border border-[#F7F2E8]/20 hover:bg-[#25201f] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>{barContent.cta.label}</span>
              <span className="text-[#E6C875] transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
