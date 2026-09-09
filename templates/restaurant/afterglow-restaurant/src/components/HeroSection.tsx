"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { heroContent } from "@/data/content";

export default function HeroSection() {
  const scrollToReservation = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("reservation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full bg-[#E9E2D4] text-[#171514] paper-grain pt-28 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Top subtle line */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex items-center justify-between border-b border-[#171514]/15 pb-3 text-xs tracking-[0.2em] font-mono uppercase text-[#702F35]"
      >
        <span>{heroContent.topStrip.left}</span>
        <span className="hidden sm:inline-block">{heroContent.topStrip.right}</span>
      </motion.div>

      {/* Main Collage Layout */}
      <div className="relative w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center py-6 sm:py-12">
        {/* Left / Overlapping Editorial Typography */}
        <div className="lg:col-span-6 z-20 flex flex-col justify-center">
          {/* Headline 1: DINNER. (First movement) */}
          <motion.div
            initial={{ opacity: 0, y: 40, skewY: 2 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-sans font-black tracking-tight leading-[0.88] text-[#171514]">
              {heroContent.headline.first}
            </h1>
          </motion.div>

          {/* Headline 2: Giant Serif STAY A WHILE. (Second movement) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1 sm:mt-2"
          >
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-serif italic text-[#702F35] tracking-tight leading-[0.95] block">
              {heroContent.headline.second}
            </span>
          </motion.div>

          {/* Small copy & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: "easeOut" }}
            className="mt-6 sm:mt-10 max-w-md space-y-6"
          >
            <p className="text-base sm:text-lg text-[#171514]/80 leading-relaxed font-sans font-normal">
              {heroContent.copy[0]}
              <br />
              {heroContent.copy[1]}
            </p>

            <div className="pt-2">
              <a
                href={heroContent.cta.href}
                onClick={scrollToReservation}
                className="group inline-flex items-center space-x-3 text-sm tracking-[0.16em] uppercase font-mono font-semibold text-[#171514] border-b-2 border-[#702F35] pb-1 hover:text-[#702F35] transition-all"
              >
                <span>{heroContent.cta.label}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 text-[#702F35]">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right / Giant Photograph of The First Table slightly off-center */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -3.5 }}
            animate={{ opacity: 1, scale: 1, rotate: -0.8 }}
            transition={{
              duration: 1.3,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ rotate: 0, transition: { duration: 0.4 } }}
            className="relative w-full max-w-[540px] aspect-[4/5] sm:aspect-[5/6] bg-[#ded6c5] shadow-2xl p-2.5 sm:p-4 border border-[#171514]/15 transform transition-transform"
          >
            {/* Lived-in table image with candle, half-eaten food, crumbs, wine */}
            <div className="relative w-full h-full overflow-hidden bg-[#241f1e]">
              <Image
                src={heroContent.image.src}
                alt={heroContent.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover contrast-[1.05] brightness-[0.98] transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Handwritten annotation near image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }}
              className="absolute -top-4 -left-4 sm:-top-5 sm:-left-6 bg-[#F7F2E8] border border-[#702F35]/30 shadow-md px-3.5 py-1.5 rounded-sm z-30"
            >
              <span className="font-hand text-xl sm:text-2xl text-[#702F35] font-bold tracking-wide">
                {heroContent.image.badge}
              </span>
            </motion.div>

            {/* Another tiny mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.45, ease: "easeOut" }}
              className="absolute -bottom-3 right-4 sm:-bottom-4 sm:right-8 bg-[#E9E2D4] border border-[#171514]/30 px-3 py-1 text-[11px] font-mono tracking-[0.2em] uppercase text-[#171514] shadow-sm z-30"
            >
              {heroContent.image.stamp}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom metadata strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#171514]/15 pt-3 text-[11px] font-mono tracking-[0.18em] uppercase text-[#171514]/60 gap-1"
      >
        <span>{heroContent.bottomStrip.left}</span>
        <span className="text-[#702F35]">{heroContent.bottomStrip.right}</span>
      </motion.div>
    </section>
  );
}
