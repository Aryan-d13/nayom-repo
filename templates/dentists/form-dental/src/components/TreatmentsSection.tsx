"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { treatmentsData, treatmentsContent } from "@/data/content";

interface TreatmentsSectionProps {
  onBookClick: () => void;
}

export default function TreatmentsSection({ onBookClick }: TreatmentsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string>("clean");

  const currentTreatment =
    treatmentsData.find((t) => t.id === hoveredId) || treatmentsData[0];

  return (
    <section id="care" className="relative bg-bone py-32 sm:py-44 overflow-hidden border-t border-stone/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 sm:mb-24 pb-8 border-b border-stone/30">
          <div>
            <p className="text-[11px] uppercase tracking-ultra font-medium text-ink/50 mb-2">
              {treatmentsContent.eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl font-light text-ink tracking-tight">
              {treatmentsContent.heading}
            </h2>
          </div>
          <p className="mt-4 sm:mt-0 text-xs tracking-widest uppercase text-ink/60">
            {treatmentsContent.disciplineCount}
          </p>
        </div>

        {/* Desktop Layout: Chapter list on left + expanding image panel on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Typographic Chapters Stack */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-stone/20">
            {treatmentsData.map((treatment) => {
              const isSelected = hoveredId === treatment.id;

              return (
                <div
                  key={treatment.id}
                  onMouseEnter={() => setHoveredId(treatment.id)}
                  onClick={() => {
                    setHoveredId(treatment.id);
                  }}
                  className={`group transition-all duration-300 cursor-pointer ${
                    isSelected ? "py-10 sm:py-12" : "py-6 sm:py-8"
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isSelected}
                  onFocus={() => setHoveredId(treatment.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="text-xs uppercase tracking-widest text-ink/40 font-mono">
                        {treatment.id === "clean" && "01"}
                        {treatment.id === "restore" && "02"}
                        {treatment.id === "straighten" && "03"}
                        {treatment.id === "refine" && "04"}
                      </span>

                      <h3
                        className={`text-4xl sm:text-6xl lg:text-7xl font-light tracking-tightest uppercase transition-all duration-300 ${
                          isSelected
                            ? "text-ink translate-x-2"
                            : "text-ink/40 group-hover:text-ink/70"
                        }`}
                      >
                        {treatment.title}
                      </h3>
                    </div>

                    <div className="flex items-center">
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            transition={{ duration: 0.2 }}
                            className="text-clay pr-2"
                          >
                            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description: fades into place when selected/hovered */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "max-h-24 opacity-100 mt-4 pl-8 sm:pl-12"
                        : "max-h-0 opacity-0 pl-8 sm:pl-12"
                    }`}
                  >
                    <p className="text-sm sm:text-base text-ink-muted font-normal max-w-lg leading-relaxed">
                      {treatment.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookClick();
                      }}
                      className="inline-block mt-3 text-xs uppercase tracking-widest text-clay font-medium hover:underline underline-offset-4"
                    >
                      {treatmentsContent.inquirePrefix} {treatment.title.toLowerCase()} {treatmentsContent.inquireSuffix}
                    </button>
                  </div>

                  {/* Mobile-only inline expanding image */}
                  <div
                    className={`lg:hidden transition-all duration-400 overflow-hidden ${
                      isSelected ? "max-h-72 opacity-100 mt-6" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative w-full h-56 rounded-sm overflow-hidden bg-stone/20">
                      <Image
                        src={treatment.image}
                        alt={treatment.alt}
                        fill
                        sizes="100vw"
                        className="object-cover filter grayscale-[15%]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Right: Image Preview that expands and transitions with hovered chapter */}
          <div className="hidden lg:block lg:col-span-5 sticky top-36">
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-stone/20 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTreatment.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentTreatment.image}
                    alt={currentTreatment.alt}
                    fill
                    sizes="(max-width: 1200px) 40vw, 35vw"
                    className="object-cover filter grayscale-[15%] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subtle caption bottom */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-xs tracking-widest uppercase flex justify-between items-center z-10">
                    <span className="font-light">{currentTreatment.title}</span>
                    <span className="text-white/70 font-mono text-[10px]">
                      {treatmentsContent.chapterLabel}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
