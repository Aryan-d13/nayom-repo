"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { backToNormalContent } from "@/data/content";

interface BackToNormalSectionProps {
  onOpenBooking: () => void;
}

export default function BackToNormalSection({
  onOpenBooking,
}: BackToNormalSectionProps) {
  const {
    label,
    headingLine1,
    headingLine2,
    headingItalic,
    subhead,
    cta,
    phone,
    phoneTel,
    location,
    image,
  } = backToNormalContent;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-28 md:py-36 px-6 md:px-12 bg-[#242522] overflow-hidden text-[#FAFAF7]">
      {/* Evening Kitchen Background with subtle warm light transition */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0.45, filter: "brightness(0.7) contrast(0.95)" }}
          whileInView={{
            opacity: 0.65,
            filter: "brightness(1.03) contrast(1.02)",
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle warm wash vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#242522] via-[#242522]/60 to-[#242522]/40" />
        </motion.div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-3 mb-6">
          <span className="w-6 h-[1px] bg-[#A86F4F]" />
          <span className="text-[11px] tracking-[0.28em] uppercase font-mono text-[#A8C7C8]">
            {label}
          </span>
          <span className="w-6 h-[1px] bg-[#A86F4F]" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-normal leading-[1.0] text-[#FAFAF7] mb-6">
          {headingLine1} <br />
          {headingLine2} <br />
          <span className="font-serif italic text-[#E9E7E1]">{headingItalic}</span>
        </h2>

        {/* Subhead */}
        <p className="text-xl sm:text-2xl text-[#E9E7E1]/85 font-normal mb-12 max-w-lg">
          {subhead}
        </p>

        {/* CTA Elements */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-10">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-3 text-[12px] tracking-[0.24em] uppercase font-semibold text-[#242522] bg-[#FAFAF7] hover:bg-[#A8C7C8] px-9 py-4 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <span>{cta}</span>
            <span className="text-[#A86F4F] font-mono">→</span>
          </button>

          <a
            href={`tel:${phoneTel}`}
            className="text-[14px] tracking-[0.16em] text-[#FAFAF7] font-mono hover:text-[#A8C7C8] transition-colors py-2 border-b border-transparent hover:border-[#A8C7C8]"
          >
            {phone}
          </a>
        </div>

        <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#E9E7E1]/50">
          {location}
        </p>
      </div>
    </section>
  );
}
