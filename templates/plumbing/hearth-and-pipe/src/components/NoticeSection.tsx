"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { noticeContent } from "@/data/content";

interface NoticeSectionProps {
  onOpenBooking: () => void;
}

const MOMENTS = noticeContent.moments;

export default function NoticeSection({ onOpenBooking }: NoticeSectionProps) {
  const [activeIndex, setActiveIndex] = useState(2); // Start on the dripping tap

  return (
    <section
      id="work"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#E9E7E1] text-[#242522] overflow-hidden transition-colors"
    >
      {/* Subtle architectural tile grid line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#D4D0C7]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-16 md:mb-24">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="w-5 h-[1px] bg-[#A86F4F]" />
            <span className="text-[11px] tracking-[0.26em] uppercase font-mono text-[#242522]/60">
              {noticeContent.label}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl tracking-tight font-normal leading-[1.05] text-[#242522]">
            {noticeContent.headingPart1} <br />
            <span className="font-serif italic text-[#A86F4F]">{noticeContent.headingItalic}</span>
          </h2>
        </div>

        {/* Editorial Spread: Sentences & Synchronized Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Sentences List */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8">
            {MOMENTS.map((moment, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={moment.id}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="cursor-pointer group select-none text-left transition-all duration-300 relative pl-6 border-l-2"
                  style={{
                    borderColor: isActive ? "#A86F4F" : "transparent",
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveIndex(index);
                    }
                  }}
                  aria-pressed={isActive}
                >
                  <p
                    className={`text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-normal tracking-tight leading-snug transition-colors duration-400 ${
                      isActive
                        ? "text-[#242522]"
                        : "text-[#242522]/30 group-hover:text-[#242522]/60"
                    }`}
                  >
                    {moment.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Corresponding Image Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#D4D0C7] shadow-[0_8px_30px_rgba(36,37,34,0.06)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={MOMENTS[activeIndex].id}
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={MOMENTS[activeIndex].image}
                    alt={MOMENTS[activeIndex].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                  {/* Subtle warm wash tone overlay */}
                  <div className="absolute inset-0 bg-[#242522]/5 mix-blend-multiply pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle photographic caption */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-[#242522]/60 uppercase">
              <span>{noticeContent.captionPrefix} 0{activeIndex + 1} / 0{MOMENTS.length}</span>
              <span>{noticeContent.captionSuffix}</span>
            </div>
          </div>
        </div>

        {/* Section Takeaway & Call to Action */}
        <div className="mt-20 md:mt-28 pt-12 border-t border-[#D4D0C7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xl sm:text-2xl md:text-3xl tracking-tight text-[#242522] font-normal">
            {noticeContent.takeaway}
          </p>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-3 text-[12px] tracking-[0.22em] uppercase font-semibold text-[#FAFAF7] bg-[#242522] hover:bg-[#A86F4F] px-8 py-4 transition-all duration-300 active:scale-[0.98]"
          >
            <span>{noticeContent.cta}</span>
            <span className="text-[#A8C7C8] font-mono">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
