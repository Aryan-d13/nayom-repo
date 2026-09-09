"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRACTICE_AREAS, practiceIndexContent } from "@/data/content";

interface PracticeIndexProps {
  onOpenContact: (practiceName?: string) => void;
}

export function PracticeIndex({ onOpenContact }: PracticeIndexProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isManualHover = useRef(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const activePractice = PRACTICE_AREAS[activeIndex] || PRACTICE_AREAS[0];

  // Scroll spy to sync the sticky right card with the practice area in view
  useEffect(() => {
    const handleScroll = () => {
      if (isManualHover.current) return;

      const section = document.getElementById("practice");
      if (!section) return;

      const secRect = section.getBoundingClientRect();
      const targetY = window.innerHeight * 0.42;

      // Only calculate if the section is actively within view
      if (secRect.top <= targetY && secRect.bottom >= targetY) {
        const items = document.querySelectorAll<HTMLElement>("[data-practice-index]");
        let closestIndex = activeIndex;
        let minDistance = Infinity;

        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.top + rect.height * 0.5;
          const dist = Math.abs(itemCenter - targetY);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = Number(item.getAttribute("data-practice-index"));
          }
        });

        if (closestIndex !== activeIndex) {
          setActiveIndex(closestIndex);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  const handleMouseEnter = (index: number) => {
    isManualHover.current = true;
    setActiveIndex(index);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      isManualHover.current = false;
    }, 1200);
  };

  return (
    <section
      id="practice"
      className="relative py-24 md:py-36 paper-texture document-rule-b"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#171817]/10 pb-6 mb-16">
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#555650] mb-3">
              <span className="text-[#9C3C35] font-semibold">{practiceIndexContent.sectionNumber}</span>
              <span className="text-[#171817]/25">|</span>
              <span>{practiceIndexContent.sectionTitle}</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#171817] tracking-tight">
              {practiceIndexContent.heading}
            </h2>
          </div>

          <p className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-wider text-[#555650] max-w-xs">
            {practiceIndexContent.subtitle}
          </p>
        </div>

        {/* Index Grid: Left list, Right dynamic photograph & detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          {/* Vertical Practice Area Rows */}
          <div className="lg:col-span-7 divide-y divide-[#171817]/10 border-y border-[#171817]/10">
            {PRACTICE_AREAS.map((practice, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={practice.id}
                  data-practice-index={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onFocus={() => handleMouseEnter(index)}
                  onClick={() => onOpenContact(practice.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${practice.name} practice details`}
                  className={`group py-10 md:py-14 transition-all duration-300 cursor-pointer outline-none relative ${
                    isActive ? "bg-[#F1EEE7]/60" : "hover:bg-[#F1EEE7]/30"
                  }`}
                >
                  {/* Narrow red rule when active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="practice-red-rule"
                        className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#9C3C35]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="pl-5 md:pl-8 pr-4">
                    {/* Index number & clause tag */}
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2">
                      <span className={isActive ? "text-[#9C3C35] font-semibold" : "text-[#555650]"}>
                        0{index + 1} // PRACTICE
                      </span>
                      <span
                        className={`transition-opacity flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#9C3C35] ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {practiceIndexContent.reviewScopeLabel} <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>

                    {/* Practice Area Large Title */}
                    <motion.h3
                      animate={{ x: isActive ? 8 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={`font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight transition-colors ${
                        isActive ? "text-[#171817]" : "text-[#171817]/80 group-hover:text-[#171817]"
                      }`}
                    >
                      {practice.name}
                    </motion.h3>

                    {/* One sentence summary under title */}
                    <p
                      className={`mt-3 text-base sm:text-lg font-sans max-w-xl leading-relaxed transition-colors ${
                        isActive ? "text-[#171817]" : "text-[#555650]"
                      }`}
                    >
                      {practice.summary}
                    </p>

                    {/* Included scope pills */}
                    <div className="mt-4 flex flex-wrap gap-2 pt-2">
                      {practice.clauses.map((clause) => (
                        <span
                          key={clause}
                          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border transition-colors ${
                            isActive
                              ? "bg-[#FCFBF7] border-[#9C3C35]/30 text-[#171817]"
                              : "bg-transparent border-[#171817]/10 text-[#555650]"
                          }`}
                        >
                          {clause}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Photograph and Case Detail Preview — Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start transition-all">
            <div className="bg-[#FCFBF7] border border-[#171817]/15 p-6 shadow-sm">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#555650] pb-3 mb-4 border-b border-[#171817]/10 flex justify-between items-center">
                <span>{practiceIndexContent.exhibitPrefix}{activeIndex + 1}</span>
                <span className="text-[#9C3C35] font-semibold tracking-wider">
                  {activePractice.name}
                </span>
              </div>

              {/* Responsive Image with slide-in transition */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#D8D4CA] mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePractice.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activePractice.image}
                      alt={activePractice.name}
                      fill
                      className="object-cover filter grayscale contrast-105"
                      sizes="(max-width: 1024px) 100vw, 450px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Extended narrative without legalese */}
              <p className="text-sm text-[#171817] leading-relaxed mb-4 min-h-[3.5rem]">
                {activePractice.detail}
              </p>

              {/* Included matters */}
              <div className="space-y-1 pt-4 border-t border-[#171817]/10">
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#555650] block mb-2">
                  {practiceIndexContent.engagementFocusLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePractice.clauses.map((clause) => (
                    <span
                      key={clause}
                      className="font-mono text-[11px] px-2.5 py-1 bg-[#F1EEE7] border border-[#171817]/10 text-[#171817]"
                    >
                      {clause}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#171817]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenContact(activePractice.name)}
                  className="font-mono text-xs text-[#171817] hover:text-[#9C3C35] uppercase tracking-wider inline-flex items-center gap-2 group font-medium cursor-pointer"
                >
                  <span>{practiceIndexContent.inquireButtonPrefix} {activePractice.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
