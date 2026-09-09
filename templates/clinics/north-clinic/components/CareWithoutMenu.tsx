"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { careWithoutMenuContent } from "@/data/content";

export default function CareWithoutMenu() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Monitor scroll position inside the section to dynamically update active word
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress within this section (0 to 1)
      const totalScrollable = rect.height - viewportHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(
        Math.max(-rect.top / totalScrollable, 0),
        0.999
      );

      const stepIndex = Math.floor(progress * careWithoutMenuContent.steps.length);
      setActiveIndex(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStep =
    careWithoutMenuContent.steps[activeIndex] || careWithoutMenuContent.steps[0];

  return (
    <section
      id="care"
      ref={sectionRef}
      className="relative bg-ivory text-ink border-b border-dust"
    >
      {/* Overline Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-24 pb-8 border-b border-dust/50 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink/50 font-sans font-medium">
            {careWithoutMenuContent.overline}
          </p>
          <p className="mt-1 text-sm text-ink/70 font-sans">
            {careWithoutMenuContent.subtitle}
          </p>
        </div>
        <span className="text-xs tracking-[0.2em] uppercase font-sans text-sage">
          STEP 0{activeIndex + 1} / 04
        </span>
      </div>

      {/* Editorial Content Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Massive Sequential Words with generous breathing space */}
          <div className="lg:col-span-6 flex flex-col gap-16 sm:gap-24 py-8">
            {careWithoutMenuContent.steps.map((step, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveIndex(idx)}
                  className="cursor-pointer group select-none transition-all duration-500"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`text-xs font-mono tracking-widest transition-colors duration-300 ${
                        isActive ? "text-sage" : "text-ink/30 group-hover:text-ink/60"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <h3
                      className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] uppercase transition-colors duration-500 ${
                        isActive
                          ? "text-ink font-normal"
                          : "text-ink/30 group-hover:text-ink/60"
                      }`}
                    >
                      {step.word}
                    </h3>
                  </div>

                  <div
                    className={`mt-4 pl-8 sm:pl-10 transition-all duration-500 overflow-hidden ${
                      isActive
                        ? "opacity-100 max-h-40 translate-y-0"
                        : "opacity-40 max-h-24 translate-y-1 group-hover:opacity-70"
                    }`}
                  >
                    <p className="text-lg sm:text-xl text-ink/80 font-sans leading-relaxed">
                      {step.description}
                    </p>
                    <p className="mt-2 text-xs tracking-wider uppercase text-sage font-sans font-medium">
                      {step.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Ambient Photographic Stage */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-sm overflow-hidden bg-dust-light shadow-sm border border-dust/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentStep.image}
                    alt={currentStep.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  
                  {/* Subtle label overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase font-sans opacity-80">
                        {careWithoutMenuContent.overlayTag}
                      </p>
                      <p className="text-xl font-serif italic mt-0.5">
                        {currentStep.word}
                      </p>
                    </div>
                    <span className="text-xs font-mono tracking-widest opacity-75">
                      0{activeIndex + 1}
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
