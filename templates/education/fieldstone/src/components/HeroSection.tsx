"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { heroContent } from "@/data/content";

interface HeroSectionProps {
  onOpenVisitModal: () => void;
}

export default function HeroSection({ onOpenVisitModal }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[96vh] pt-24 sm:pt-28 pb-20 px-6 sm:px-8 lg:px-12 bg-[#F5F1E8] text-[#20231F] overflow-hidden flex flex-col justify-between"
    >
      {/* Background subtle graph/scrapbook grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#20231F 1px, transparent 1px), linear-gradient(90deg, #20231F 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left / Center-Left: Editorial Typography */}
          <div className="lg:col-span-7 xl:col-span-6 relative z-20">
            {/* Small text: SEATTLE / K–12 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#D76C56]" />
              <span className="text-xs sm:text-sm uppercase font-semibold tracking-[0.25em] text-[#20231F]/80">
                {heroContent.topBadge}
              </span>
              <span className="text-xs text-[#73866C] font-mono">
                {heroContent.topBadgeSub}
              </span>
            </motion.div>

            {/* Headline: COME CURIOUS. */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#20231F] leading-[0.92] uppercase"
            >
              {heroContent.headingMain} <br />
              <span className="relative inline-block">
                {heroContent.headingAccent}
                {/* Playful subtle handwritten underline or accent note */}
                <span className="font-handwritten text-xl sm:text-2xl lowercase font-normal text-[#D76C56] absolute -right-4 sm:-right-8 -top-3 rotate-12 hidden sm:inline-block">
                  {heroContent.handwrittenAccent}
                </span>
              </span>
            </motion.h1>

            {/* Large serif line */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-title text-2xl sm:text-4xl lg:text-5xl text-[#4E7FA3] italic mt-6 leading-tight max-w-xl"
            >
              {heroContent.serifSubheading}
            </motion.p>

            {/* Supporting copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-base sm:text-lg text-[#20231F]/85 mt-6 max-w-lg leading-relaxed"
            >
              {heroContent.bodyCopy}
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-9"
            >
              <button
                onClick={onOpenVisitModal}
                className="px-8 py-4 bg-[#20231F] hover:bg-[#D76C56] text-[#FFFDF8] font-bold text-xs sm:text-sm tracking-widest uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>{heroContent.primaryCta}</span>
              </button>

              <button
                onClick={() => scrollTo("interests")}
                className="text-xs sm:text-sm font-semibold tracking-wider text-[#20231F] hover:text-[#4E7FA3] transition-colors py-3 px-2 inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-8 decoration-[#E5B84C] decoration-2"
              >
                <span>{heroContent.secondaryCta}</span>
                <span className="text-base">↓</span>
              </button>
            </motion.div>
          </div>

          {/* Right: The Scattered Desk Scrapbook Collage */}
          <div className="lg:col-span-5 xl:col-span-6 relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] w-full flex items-center justify-center">
            {/* Scrapbook Container */}
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Photo 1: Student Painting — slides in from top-right */}
              <motion.div
                initial={{ opacity: 0, x: 80, y: -40, rotate: -8 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
                className="absolute top-2 right-4 sm:right-8 w-44 sm:w-56 md:w-64 aspect-[4/5] bg-[#FFFDF8] p-2 sm:p-2.5 shadow-xl rounded-xs photo-border cursor-pointer transition-shadow"
              >
                {/* Washi Tape Strip */}
                <div className="absolute -top-3 left-1/3 w-14 h-4 bg-[#E5B84C]/80 rotate-2 shadow-xs backdrop-blur-xs z-10" />
                <div className="relative w-full h-full overflow-hidden bg-[#20231F]/5">
                  <Image
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80"
                    alt="Student painting with watercolor palette"
                    fill
                    sizes="(max-width: 768px) 200px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="font-handwritten text-xs text-[#20231F]/80 mt-1.5 px-1 truncate">
                  {heroContent.photoLabels.paintingCaption}
                </p>
              </motion.div>

              {/* Photo 2: Child with Microscope — rotates slightly into place */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 18 }}
                animate={{ opacity: 1, scale: 1, rotate: 3.5 }}
                transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: 0, scale: 1.04, zIndex: 30 }}
                className="absolute bottom-6 right-0 sm:right-6 w-48 sm:w-60 md:w-68 aspect-square bg-[#FFFDF8] p-2 sm:p-3 shadow-2xl rounded-xs photo-border cursor-pointer"
              >
                {/* Coral Tape Strip */}
                <div className="absolute -bottom-2 right-6 w-16 h-4 bg-[#D76C56]/80 -rotate-3 shadow-xs z-10" />
                <div className="relative w-full h-[84%] overflow-hidden bg-[#20231F]/5">
                  <Image
                    src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80"
                    alt="Child looking through microscope in science lab"
                    fill
                    sizes="(max-width: 768px) 220px, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex justify-between items-center mt-1 px-1">
                  <span className="font-mono text-[10px] tracking-wider text-[#73866C] uppercase font-bold">
                    {heroContent.photoLabels.microscopeTag}
                  </span>
                  <span className="font-handwritten text-sm text-[#D76C56]">
                    {heroContent.photoLabels.microscopeZoom}
                  </span>
                </div>
              </motion.div>

              {/* Photo 3: Student Building Something — reveals from behind */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
                className="absolute top-36 sm:top-40 left-2 sm:left-6 w-44 sm:w-56 md:w-60 aspect-[3/4] bg-[#FFFDF8] p-2 sm:p-2.5 shadow-lg rounded-xs photo-border cursor-pointer"
              >
                {/* Tape Strip */}
                <div className="absolute -top-2.5 right-4 w-12 h-3.5 bg-[#73866C]/70 rotate-6 shadow-xs z-10" />
                <div className="relative w-full h-full overflow-hidden bg-[#20231F]/5">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80"
                    alt="Student building structural wood joinery"
                    fill
                    sizes="(max-width: 768px) 200px, 280px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="font-handwritten text-xs text-[#20231F]/70 mt-1 px-1">
                  {heroContent.photoLabels.buildingCaption}
                </p>
              </motion.div>

              {/* Photo 4: Theatre Rehearsal — small accent collage card */}
              <motion.div
                initial={{ opacity: 0, y: -30, rotate: -12 }}
                animate={{ opacity: 1, y: 0, rotate: 6 }}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                whileHover={{ scale: 1.06, rotate: 2, zIndex: 30 }}
                className="absolute top-0 left-0 sm:left-4 w-32 sm:w-40 aspect-[4/3] bg-[#FFFDF8] p-1.5 shadow-md rounded-xs border-4 border-[#FFFDF8] cursor-pointer"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=500&q=80"
                    alt="Theatre rehearsal stage moment"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Photo 5: Playing Outside — lower left courtyard moment */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                className="absolute -bottom-4 left-10 sm:left-24 w-36 sm:w-44 aspect-[4/3] bg-[#FFFDF8] p-2 shadow-xl rounded-xs photo-border cursor-pointer hidden sm:block"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=500&q=80"
                    alt="Students playing outside on grass"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Decorative hand-drawn stamp note on desk */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                className="absolute bottom-28 left-4 sm:-left-6 bg-[#E5B84C] text-[#20231F] px-3.5 py-1.5 rounded-full font-handwritten text-base font-bold shadow-md -rotate-12 pointer-events-none z-20 border border-[#20231F]/15"
              >
                {heroContent.photoLabels.deskStamp}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-[#20231F]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#20231F]/60 gap-3">
        <div className="flex items-center gap-6 font-mono">
          <span>{heroContent.bottomBar.type}</span>
          <span className="hidden sm:inline">{heroContent.bottomBar.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#73866C]" />
          <span>{heroContent.bottomBar.status}</span>
        </div>
      </div>
    </section>
  );
}
