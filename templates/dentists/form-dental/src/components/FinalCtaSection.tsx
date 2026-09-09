"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { clinicInfo, finalCtaContent } from "@/data/content";

interface FinalCtaSectionProps {
  onBookClick: () => void;
}

export default function FinalCtaSection({ onBookClick }: FinalCtaSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15, once: true });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasRevealed(true);
    }
  }, [isInView]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-clay text-bone py-36 sm:py-48 overflow-hidden min-h-[85vh] flex items-center justify-center"
    >
      {/* Background Photograph: reveals with a circular gradient expand and stays visible permanently */}
      <motion.div
        initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
        animate={
          hasRevealed
            ? { clipPath: "circle(150% at 50% 50%)", opacity: 0.42 }
            : { clipPath: "circle(0% at 50% 50%)", opacity: 0 }
        }
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <Image
          src={finalCtaContent.bgImage}
          alt={finalCtaContent.bgAlt}
          fill
          sizes="100vw"
          className="object-cover object-center filter grayscale-[30%] brightness-[0.7] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-clay/40 mix-blend-multiply pointer-events-none" />
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <p className="text-[11px] uppercase tracking-ultra font-medium text-bone/70 mb-6">
          {finalCtaContent.eyebrow}
        </p>

        {/* Huge Cream Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tightest uppercase text-white mb-6 max-w-4xl leading-[0.95]">
          {finalCtaContent.headline}
        </h2>

        {/* Smaller Serif Subtitle */}
        <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-bone/90 mb-12 font-normal">
          {finalCtaContent.subheading}
        </p>

        {/* Primary Action Button: visually obvious */}
        <div className="mb-14">
          <button
            onClick={onBookClick}
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-bone text-ink hover:bg-white text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-clay"
          >
            <span>{finalCtaContent.cta.replace(" →", "")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
        </div>

        {/* Clinic Direct Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xs uppercase tracking-widest text-bone/80 pt-4 border-t border-bone/20 w-full max-w-xl">
          <a
            href={`tel:${clinicInfo.phoneRaw}`}
            className="flex items-center gap-2 hover:text-white transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 text-bone/60 group-hover:text-white transition-colors" />
            <span>{finalCtaContent.phone}</span>
          </a>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-bone/60" />
            <span>{finalCtaContent.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
