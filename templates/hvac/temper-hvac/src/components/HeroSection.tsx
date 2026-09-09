"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTemperature } from "@/context/TemperatureContext";
import { ArrowRight, Phone } from "lucide-react";
import { heroContent, businessInfo } from "@/data/content";

export default function HeroSection() {
  const { openBooking } = useTemperature();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger thermal balance animation after brief initial frame
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-end overflow-hidden pt-24 pb-16 lg:pb-24">
      {/* Background Image Container with Temperature Transition */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroContent.image}
          alt={heroContent.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-[4000ms] ease-out"
        />

        {/* Initial Warm Heat-Wave Overlay that slowly drains */}
        <motion.div
          initial={{ opacity: 0.65 }}
          animate={{ opacity: isLoaded ? 0 : 0.65 }}
          transition={{ duration: 3.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 bg-gradient-to-tr from-[#A95B43]/55 via-[#E9D9BE]/40 to-[#A95B43]/30 mix-blend-color pointer-events-none"
        />

        {/* Cool Thermal Refresh Wash that gently expands from the left */}
        <motion.div
          initial={{ opacity: 0, x: "-30%" }}
          animate={{ opacity: isLoaded ? 0.35 : 0, x: isLoaded ? "0%" : "-30%" }}
          transition={{ duration: 3.6, delay: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-[#C8DDE0]/50 via-[#C8DDE0]/20 to-transparent mix-blend-soft-light pointer-events-none"
        />

        {/* Gradient for text contrast without blocking the architectural view */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />
      </div>

      {/* Hero Content (Lower-Left placement) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Small Label */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-6 h-[1.5px] bg-sky" />
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-cream">
              {heroContent.overline}
            </span>
          </motion.div>

          {/* Headline Revealed Line-by-Line */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05] mb-4">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="block"
            >
              {heroContent.headlineLine1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95 }}
              className="block text-sand"
            >
              {heroContent.headlineLine2}
            </motion.span>
          </h1>

          {/* Serif Line Appearing Last */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.4 }}
            className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-sky mb-6 font-light tracking-wide"
          >
            {heroContent.serifLine}
          </motion.p>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.8 }}
            className="text-base sm:text-lg text-cream/90 max-w-xl font-light leading-relaxed mb-8"
          >
            {heroContent.description}
          </motion.p>

          {/* Primary CTA and Secondary Phone Link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.1 }}
            className="flex flex-wrap items-center gap-5 pt-2"
          >
            <button
              type="button"
              onClick={() => openBooking()}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-terracotta text-white hover:bg-white hover:text-ink transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>{heroContent.bookCta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-cream/30 text-cream hover:bg-cream/10 hover:border-cream transition-all duration-300 text-xs sm:text-sm tracking-wider font-mono cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-sky" />
              <span>{heroContent.phone}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
