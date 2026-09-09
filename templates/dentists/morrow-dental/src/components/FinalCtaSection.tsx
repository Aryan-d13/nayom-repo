"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { finalCtaContent, clinicData } from "@/data/content";

interface FinalCtaSectionProps {
  onOpenBooking: () => void;
}

export default function FinalCtaSection({ onOpenBooking }: FinalCtaSectionProps) {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center bg-[#D9B8AE] overflow-hidden py-24 px-6 sm:px-10 lg:px-12"
    >
      {/* Huge Portrait Photograph Slowly Appearing Behind Typography (Part of face emerging from color field) */}
      <motion.div
        initial={{ opacity: 0.08, scale: 1.03 }}
        whileInView={{ opacity: 0.28, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute inset-0 pointer-events-none select-none mix-blend-multiply"
      >
        <Image
          src={finalCtaContent.image}
          alt={finalCtaContent.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-[70%_25%] sm:object-[65%_center] filter contrast-125"
        />
        {/* Soft radial vignette to ensure high contrast for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D9B8AE] via-[#D9B8AE]/85 to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <span className="text-xs font-mono tracking-widest uppercase text-ink/70 block mb-4">
            {finalCtaContent.eyebrow}
          </span>

          {/* Very Large Dark Typography */}
          <h2 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-ink leading-[1.02] uppercase mb-4">
            {finalCtaContent.headline}
          </h2>

          {/* Serif Line */}
          <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-ink/90 font-light mb-8">
            {finalCtaContent.serifSubtitle}
          </p>

          {/* Small Supporting Copy */}
          <p className="text-base sm:text-lg text-ink/80 font-light max-w-md mb-10">
            {finalCtaContent.copy}
          </p>

          {/* CTA & Direct Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 mb-12">
            <button
              onClick={onOpenBooking}
              className="px-9 py-4 bg-ink text-porcelain text-xs font-medium uppercase tracking-widest hover:bg-ink-light transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {finalCtaContent.cta}
            </button>

            <div className="flex flex-col text-xs font-mono tracking-wider text-ink/80 space-y-1">
              <a
                href={`tel:${clinicData.phoneRaw}`}
                className="hover:text-ink transition-colors font-semibold"
              >
                {finalCtaContent.phone}
              </a>
              <span>{finalCtaContent.address}</span>
            </div>
          </div>

          <div className="pt-8 border-t border-ink/15 flex items-center justify-between text-[11px] font-mono tracking-widest text-ink/60 uppercase">
            <span>MON–FRI · 8 AM–5 PM</span>
            <span>INTIMATE PORTRAITURE & CARE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
