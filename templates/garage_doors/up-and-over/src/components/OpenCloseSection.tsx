"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { openCloseContent, MOMENTS, MomentItem } from "@/data/content";

export default function OpenCloseSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const current: MomentItem = MOMENTS[activeStep];

  const nextMoment = () => {
    setActiveStep((prev) => (prev + 1) % MOMENTS.length);
  };

  const prevMoment = () => {
    setActiveStep((prev) => (prev - 1 + MOMENTS.length) % MOMENTS.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveStep((prev) => (prev + 1) % MOMENTS.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveStep((prev) => (prev - 1 + MOMENTS.length) % MOMENTS.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="open-close"
      className="relative w-full min-h-[90vh] lg:min-h-screen bg-[#111311] text-[#F5F1E8] flex flex-col justify-between overflow-hidden py-16 sm:py-24"
    >
      {/* Background Architectural Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            filter: `brightness(${current.lightingBrightness}) contrast(1.05)`,
          }}
        >
          <Image
            src={openCloseContent.image.src}
            alt={openCloseContent.image.alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Ambient Dark Scrim for High-Contrast Clean Typography */}
        <div className="absolute inset-0 bg-[#111311]/70 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111311] via-transparent to-[#111311]/80 pointer-events-none" />
      </div>

      {/* Top Header */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 w-full flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#A85F45] uppercase block mb-1">
            {openCloseContent.sectionTag}
          </span>
          <p className="text-xs font-mono text-[#D4D0C7] uppercase tracking-widest">
            {openCloseContent.subtitle}
          </p>
        </div>

        <span className="text-xs font-mono tracking-widest text-[#D4D0C7]">
          {openCloseContent.cycleLabel} 0{activeStep + 1} / 0{MOMENTS.length}
        </span>
      </div>

      {/* Center Huge Typography */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 w-full my-auto py-12 sm:py-20 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-3xl"
          >
            <h2 className="font-serif text-7xl sm:text-9xl lg:text-[12rem] font-extralight tracking-tight text-[#F5F1E8] leading-none select-none drop-shadow-lg">
              {current.word}
            </h2>

            <p className="font-serif italic text-xl sm:text-3xl text-[#F5F1E8] mt-6 tracking-wide drop-shadow">
              {current.sub}
            </p>

            <p className="text-sm font-sans text-[#D4D0C7] mt-3 max-w-md leading-relaxed">
              {current.narrative}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tactile State Scrubber Bar */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 sm:px-10 w-full">
        <div className="bg-[#202321]/95 border border-white/20 backdrop-blur-md p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4">
            {MOMENTS.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 text-center py-2.5 transition-all relative ${
                    isActive
                      ? "text-[#F5F1E8] font-medium"
                      : "text-[#D4D0C7]/60 hover:text-[#F5F1E8]"
                  }`}
                >
                  <span className="block text-[10px] font-mono tracking-widest uppercase mb-0.5">
                    0{idx + 1}
                  </span>
                  <span className="font-serif text-base sm:text-lg tracking-widest">
                    {item.id}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="moment-active-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#A85F45]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-mono">
            <button
              onClick={prevMoment}
              className="text-[#D4D0C7] hover:text-white transition-colors tracking-widest uppercase py-1"
            >
              {openCloseContent.prevLabel}
            </button>

            <span className="text-[10px] tracking-[0.2em] text-[#A85F45] uppercase">
              {openCloseContent.currentStateLabel} {current.id}
            </span>

            <button
              onClick={nextMoment}
              className="text-[#D4D0C7] hover:text-white transition-colors tracking-widest uppercase py-1"
            >
              {openCloseContent.nextLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
