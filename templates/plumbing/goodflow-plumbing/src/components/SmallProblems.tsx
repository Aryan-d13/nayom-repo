"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SMALL_PROBLEMS, smallProblemsContent } from "@/data/content";

interface SmallProblemsProps {
  onOpenBooking: (serviceName?: string) => void;
}

export function SmallProblems({ onOpenBooking }: SmallProblemsProps) {
  const [activeProblemId, setActiveProblemId] = useState<string>(
    SMALL_PROBLEMS[0].id
  );
  const [hoveredProblemId, setHoveredProblemId] = useState<string | null>(null);

  const currentDisplayProblem =
    SMALL_PROBLEMS.find(
      (p) => p.id === (hoveredProblemId || activeProblemId)
    ) || SMALL_PROBLEMS[0];

  return (
    <section
      id="services"
      className="relative bg-[#D8E9EA] text-[#15212A] py-20 sm:py-24 md:py-32 overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-3 font-medium">
            {smallProblemsContent.sectionNumber}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#15212A] max-w-2xl leading-tight">
            {smallProblemsContent.heading}
          </h2>
        </div>

        {/* Oversized Editorial Sentences with Soft Image Replacement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Oversized Vertical List */}
          <div className="lg:col-span-8 flex flex-col divide-y divide-[#15212A]/15 border-t border-b border-[#15212A]/15">
            {SMALL_PROBLEMS.map((problem) => {
              const isSelected =
                (hoveredProblemId || activeProblemId) === problem.id;

              return (
                <div
                  key={problem.id}
                  onMouseEnter={() => setHoveredProblemId(problem.id)}
                  onMouseLeave={() => setHoveredProblemId(null)}
                  onClick={() => {
                    setActiveProblemId(problem.id);
                  }}
                  className="group py-6 sm:py-8 transition-colors duration-200 cursor-pointer select-none"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    {/* Oversized Sentence */}
                    <div
                      className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-normal tracking-tight transition-transform duration-300 ease-out ${
                        isSelected
                          ? "translate-x-3 sm:translate-x-4 text-[#15212A]"
                          : "text-[#15212A]/70 group-hover:text-[#15212A]"
                      }`}
                    >
                      <span>{problem.title}</span>
                    </div>

                    {/* Subtle status dot */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                        isSelected
                          ? "bg-[#397A91] scale-125 ring-4 ring-[#397A91]/20"
                          : "bg-[#15212A]/20 group-hover:bg-[#15212A]/40"
                      }`}
                    />
                  </div>

                  {/* Subtitle notes */}
                  <motion.p
                    initial={false}
                    animate={{
                      opacity: isSelected ? 1 : 0,
                      height: isSelected ? "auto" : 0,
                      marginTop: isSelected ? 8 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden text-xs sm:text-sm text-[#15212A]/80 font-normal max-w-xl pl-3 sm:pl-4"
                  >
                    {problem.subtitle}
                  </motion.p>

                  {/* Mobile Inline Image Reveal */}
                  <div className="lg:hidden mt-4">
                    <AnimatePresence>
                      {activeProblemId === problem.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 220 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full rounded-none overflow-hidden border border-[#15212A]/20"
                        >
                          <Image
                            src={problem.image}
                            alt={problem.alt}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Desktop): Floating Editorial Image Replacement View */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="relative w-full aspect-4/5 rounded-none border border-[#15212A]/15 bg-[#F4F0E7] p-2 shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDisplayProblem.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full overflow-hidden"
                >
                  <Image
                    src={currentDisplayProblem.image}
                    alt={currentDisplayProblem.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15212A]/50 via-transparent to-transparent pointer-events-none" />

                  {/* Caption badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#F4F0E7]/95 p-2.5 border border-[#15212A]/10 text-[#15212A]">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#397A91]">
                      {smallProblemsContent.spotlightLabel}
                    </p>
                    <p className="text-xs font-normal text-[#15212A] mt-0.5">
                      {currentDisplayProblem.title}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Closing Statement & CTA */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#15212A]/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-base sm:text-lg md:text-xl text-[#15212A] font-normal max-w-xl leading-snug">
            {smallProblemsContent.closingStatement}
          </p>

          <button
            type="button"
            onClick={() => onOpenBooking(currentDisplayProblem.title)}
            className="group self-start md:self-auto inline-flex items-center gap-3 bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] px-6 py-3.5 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer"
          >
            <span>{smallProblemsContent.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#D8E9EA]" />
          </button>
        </div>
      </div>
    </section>
  );
}
