"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FINAL_CTA_CONTENT, BRAND } from "@/data/content";
import { Phone } from "lucide-react";

interface FinalStayProps {
  onOpenProjectModal: () => void;
}

export default function FinalStay({ onOpenProjectModal }: FinalStayProps) {
  return (
    <section
      id="contact"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-ink py-24 sm:py-32"
      aria-label="Final Invitation: Maybe You Don't Need a New Home"
    >
      {/* Background Image: Slowly brightens as section enters */}
      <motion.div
        initial={{ opacity: 0.65, scale: 1.02, filter: "brightness(0.65)" }}
        whileInView={{ opacity: 0.9, scale: 1, filter: "brightness(0.95)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={FINAL_CTA_CONTENT.image}
          alt={FINAL_CTA_CONTENT.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Warm photographic darkening wash to ensure 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/65 to-ink/75" />
      </motion.div>

      {/* Editorial Content: Restrained, letting the sentence do the work */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* Subtle Category Tag */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[11px] font-sans uppercase tracking-[0.3em] text-dust/90 font-medium mb-8"
        >
          {FINAL_CTA_CONTENT.sectionTag}
        </motion.span>

        {/* Headline: MAYBE YOU DON'T NEED A NEW HOME. */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-warm-white uppercase max-w-4xl"
        >
          {FINAL_CTA_CONTENT.headlineLines.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < FINAL_CTA_CONTENT.headlineLines.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>

        {/* Large Serif Statement: Maybe you need a better version of this one. */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-dust font-normal mt-8 mb-12 max-w-2xl leading-snug"
        >
          {FINAL_CTA_CONTENT.serifLine}
        </motion.p>

        {/* CTAs & Direct Contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8"
        >
          <button
            onClick={onOpenProjectModal}
            className="px-8 py-4 bg-warm-white text-ink hover:bg-parchment text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {FINAL_CTA_CONTENT.primaryCTA}
          </button>

          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="flex items-center text-xs tracking-[0.18em] uppercase text-warm-white/90 hover:text-warm-white transition-colors py-2 group"
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-terracotta group-hover:scale-110 transition-transform" />
            <span>{FINAL_CTA_CONTENT.phone}</span>
          </a>
        </motion.div>

        {/* Small Line: Portland, Oregon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-xs font-mono tracking-[0.25em] text-dust/70 uppercase"
        >
          {FINAL_CTA_CONTENT.location}
        </motion.div>

      </div>
    </section>
  );
}
