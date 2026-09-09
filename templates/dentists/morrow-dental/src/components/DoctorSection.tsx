"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { doctorContent, clinicData } from "@/data/content";

interface DoctorSectionProps {
  onOpenBooking: () => void;
}

export default function DoctorSection({ onOpenBooking }: DoctorSectionProps) {
  const [showPersonalNote, setShowPersonalNote] = useState(false);

  return (
    <section id="team" className="py-24 sm:py-32 lg:py-40 bg-porcelain border-t border-stone/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Candid Portrait Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none overflow-hidden bg-stone/20">
              <Image
                src={doctorContent.image}
                alt={doctorContent.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center filter contrast-[1.02]"
              />
              <div className="absolute bottom-3 left-4 text-[10px] font-mono tracking-widest text-white/90 uppercase">
                {doctorContent.portraitCaption}
              </div>
            </div>
          </div>

          {/* Quote & Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-6">
              {doctorContent.eyebrow}
            </span>

            {/* Candid Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink leading-relaxed font-light mb-8">
              {doctorContent.quote}
            </blockquote>

            {/* Doctor Info */}
            <div className="border-l-2 border-stone pl-6 mb-8">
              <h3 className="text-xl sm:text-2xl font-sans font-medium text-ink tracking-tight">
                {doctorContent.name}
              </h3>
              <p className="text-xs uppercase tracking-widest font-mono text-ink/60 mt-1">
                {doctorContent.role}
              </p>
            </div>

            {/* Human Paragraph (No fake stats or exaggerated bios) */}
            <p className="text-base sm:text-lg text-ink/70 font-light leading-relaxed max-w-xl mb-10">
              {doctorContent.paragraph}
            </p>

            {/* Meet Maya Action */}
            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => setShowPersonalNote(!showPersonalNote)}
                className="text-xs uppercase tracking-widest text-ink hover:text-ink/60 transition-colors py-2 border-b border-ink font-medium cursor-pointer"
              >
                {doctorContent.cta}
              </button>
              <button
                onClick={onOpenBooking}
                className="text-xs uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
              >
                {doctorContent.directVisitCta}
              </button>
            </div>

            {/* Expandable candid studio note */}
            <AnimatePresence>
              {showPersonalNote && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden mt-6 pt-6 border-t border-stone/30"
                >
                  <p className="text-sm font-light text-ink/80 leading-relaxed max-w-lg mb-3">
                    {doctorContent.personalNote}
                  </p>
                  <span className="text-xs font-mono text-ink/50 uppercase tracking-widest">
                    {doctorContent.personalNoteAuthor}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
