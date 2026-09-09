"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { commonCallsContent } from "@/data/content";

interface CommonCallsProps {
  onOpenBooking: (service?: string) => void;
}

const CALLS = commonCallsContent.calls;

export default function CommonCalls({ onOpenBooking }: CommonCallsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCall = CALLS[activeIndex];

  return (
    <section
      id="common-calls"
      className="relative py-24 sm:py-32 bg-[#F3EFE7] border-t border-[#17252A]/10 overflow-hidden selection:bg-[#DDF0EC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#68B8C3]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#17252A]/60">
              {commonCallsContent.sectionTag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#17252A] uppercase">
            {commonCallsContent.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#17252A]/75 font-normal">
            {commonCallsContent.description}
          </p>
        </div>

        {/* Side-by-Side Visual Index Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Vertical Index List (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-6">
            {CALLS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#FFFDF8] border-l-4 border-[#17252A] shadow-md pl-6"
                      : "bg-transparent border-l-4 border-transparent hover:bg-[#FFFDF8]/40 pl-4 opacity-40 hover:opacity-75"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#17252A]/50">
                      {item.code}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-semibold text-[#68B8C3] tracking-widest uppercase">
                        ACTIVE ITEM
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-2xl sm:text-4xl font-bold tracking-tight uppercase transition-colors ${
                      isActive ? "text-[#17252A]" : "text-[#17252A]/60"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-3 border-t border-[#17252A]/10 space-y-2"
                    >
                      <p className="text-xs sm:text-sm text-[#17252A]/80 font-normal leading-relaxed">
                        {item.details}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBooking(item.serviceCategory);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C86650] hover:text-[#b55844] pt-1"
                      >
                        <span>Schedule diagnostic for {item.title.toLowerCase()}</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              );
            })}

            {/* Bottom link: SEE ALL SERVICES → */}
            <div className="pt-6">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#17252A] hover:text-[#68B8C3] transition-colors group cursor-pointer"
              >
                <span>{commonCallsContent.allServicesCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Synchronized Crossfading Photograph (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF8] bg-[#17252A]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCall.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeCall.image}
                    alt={activeCall.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Gradient mask for readable caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17252A]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Lower Photographic Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#FFFDF8]/90 backdrop-blur-md border border-[#17252A]/10 text-[#17252A]">
                    <span className="text-[10px] font-mono tracking-widest text-[#68B8C3] uppercase block mb-0.5">
                      REAL SITUATION // {activeCall.title}
                    </span>
                    <p className="text-xs font-medium text-[#17252A]/90">
                      {activeCall.caption}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle decorative architectural tag */}
            <div className="hidden lg:block absolute -top-4 -right-4 px-3 py-1 bg-[#17252A] text-[#FFFDF8] rounded-md text-[10px] font-mono">
              INDEX 0{activeIndex + 1} / 05
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
