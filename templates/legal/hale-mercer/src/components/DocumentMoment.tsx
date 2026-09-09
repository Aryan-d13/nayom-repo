"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DOCUMENT_CHOICES, documentMomentContent } from "@/data/content";

interface DocumentMomentProps {
  onOpenContact: (inquiry?: string) => void;
}

export function DocumentMoment({ onOpenContact }: DocumentMomentProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(3); // Default to "I don't know where to start"

  const activeChoice = DOCUMENT_CHOICES[selectedIndex];

  return (
    <section
      id="matter-024"
      className="relative py-28 md:py-40 bg-[#171817] text-[#FCFBF7] dark-paper-texture overflow-hidden border-t border-[#333]"
    >
      {/* Editorial Watermark / Stamp */}
      <div className="absolute right-8 top-12 font-mono text-[9px] uppercase tracking-[0.3em] text-[#FCFBF7]/20 select-none pointer-events-none hidden md:block">
        {documentMomentContent.watermark}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Document Header Docket */}
        <div className="border-b border-[#FCFBF7]/15 pb-6 mb-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#9C3C35] rounded-full" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D8D4CA]">
              {documentMomentContent.matterNumber}
            </span>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-widest text-[#D8D4CA]/60">
            {documentMomentContent.intakeSubtitle}
          </div>
        </div>

        {/* Large Serif Title */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#FCFBF7] tracking-tight leading-[1.05]">
            {documentMomentContent.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D8D4CA]/70 mt-4 max-w-xl">
            {documentMomentContent.description}
          </p>
        </div>

        {/* The Sequence of Choices & Side Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Interactive list typed/revealed */}
          <div className="lg:col-span-7 space-y-6">
            {DOCUMENT_CHOICES.map((choice, index) => {
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={choice.id}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => setSelectedIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  className={`group relative p-6 border transition-all duration-300 cursor-pointer outline-none ${
                    isSelected
                      ? "bg-[#FCFBF7]/5 border-[#9C3C35]/60"
                      : "bg-transparent border-[#FCFBF7]/10 hover:border-[#FCFBF7]/30"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[#D8D4CA]/40 group-hover:text-[#9C3C35] transition-colors">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>

                    <div className="flex-1">
                      <div className="relative inline-block">
                        <span className="font-serif text-2xl sm:text-3xl text-[#FCFBF7] font-normal leading-snug tracking-tight">
                          {choice.label}
                        </span>

                        {/* Red underline when hovered / selected */}
                        {isSelected && (
                          <motion.div
                            layoutId="matter-underline"
                            className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#9C3C35]"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 28,
                            }}
                          />
                        )}
                      </div>

                      <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#D8D4CA]/50">
                        {choice.marginalNote}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: The Human Guidance Side Sheet */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-[#212221] border border-[#FCFBF7]/15 p-8 md:p-10 shadow-2xl relative">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#D8D4CA]/60 pb-3 border-b border-[#FCFBF7]/10 flex justify-between items-center mb-6">
                <span>{documentMomentContent.attorneyNoteHeaderLeft}</span>
                <span className="text-[#9C3C35] font-semibold">{documentMomentContent.attorneyNoteHeaderRight}</span>
              </div>

              <div className="min-h-[140px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChoice.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#FCFBF7] font-normal leading-snug">
                      &ldquo;{activeChoice.guidance}&rdquo;
                    </blockquote>
                    <p className="mt-4 font-sans text-xs md:text-sm text-[#D8D4CA]/80 leading-relaxed">
                      {documentMomentContent.partnerGuarantee}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-[#FCFBF7]/10">
                <button
                  type="button"
                  onClick={() => onOpenContact(activeChoice.label)}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#FCFBF7] text-[#171817] hover:bg-[#9C3C35] hover:text-[#FCFBF7] transition-all duration-300 font-mono text-xs uppercase tracking-widest font-semibold group"
                >
                  <span>{documentMomentContent.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-[#D8D4CA]/60">
                  {documentMomentContent.confidentialityNotice}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
