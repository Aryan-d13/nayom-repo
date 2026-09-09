"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { finalCtaContent, businessInfo } from "@/data/content";

interface FinalCtaSectionProps {
  onOpenQuote: (service?: string) => void;
}

export default function FinalCtaSection({ onOpenQuote }: FinalCtaSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#111311] text-[#F5F1E8] py-24 sm:py-32"
    >
      {/* Background Evening Home */}
      <div className="absolute inset-0 z-0">
        <Image
          src={finalCtaContent.image.src}
          alt={finalCtaContent.image.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />

        {/* Cinematic dark scrim for high contrast legibility */}
        <div className="absolute inset-0 bg-[#111311]/75 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111311] via-transparent to-[#111311]/80 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="inline-block w-full"
        >
          <p className="text-[11px] font-mono tracking-[0.25em] text-[#A85F45] uppercase mb-4">
            {finalCtaContent.tag}
          </p>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#F5F1E8] tracking-tight leading-[1.08] mb-4 drop-shadow-md">
            {finalCtaContent.headingPart1} <br />
            <span className="font-normal italic">{finalCtaContent.headingPart2}</span>
          </h2>

          <p className="font-serif text-xl sm:text-2xl text-[#D4D0C7] font-light mb-8 italic">
            {finalCtaContent.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenQuote("Garage Door Replacement")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#A85F45] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45]/90 transition-all shadow-xl group"
            >
              <span>{finalCtaContent.primaryCta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#F5F1E8] hover:text-[#A85F45] transition-colors py-3 px-6 border border-white/20 hover:border-white/40"
            >
              <Phone className="w-3.5 h-3.5 text-[#A85F45]" />
              <span>{businessInfo.phone}</span>
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 text-center">
            <p className="text-xs text-[#D4D0C7] font-mono">
              {finalCtaContent.footerNote}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
