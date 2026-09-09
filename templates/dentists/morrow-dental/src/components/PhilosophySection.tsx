"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { philosophyContent } from "@/data/content";

export default function PhilosophySection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activePillar = philosophyContent.pillars[activeIndex];

  return (
    <section
      id="approach"
      className="py-24 sm:py-32 lg:py-40 bg-white border-t border-b border-stone/30"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Editorial Statement */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-ink leading-[1.1] uppercase mb-4"
          >
            {philosophyContent.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-ink/80 font-light"
          >
            {philosophyContent.serifPrefix}
            <span className="font-serif italic font-normal text-ink">
              {philosophyContent.serifSubtitle}
            </span>
          </motion.p>
        </div>

        {/* Interactive Oversized Words & Crossfading Portrait Studio Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Oversized Words Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8">
            {philosophyContent.pillars.map((pillar, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="group cursor-pointer text-left transition-colors duration-500 select-none"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span
                      className={`text-xs font-mono transition-colors duration-500 ${
                        isActive ? "text-ink" : "text-stone/50"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <h3
                      className={`font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight transition-all duration-700 leading-none ${
                        isActive
                          ? "text-ink font-medium translate-x-1 sm:translate-x-2"
                          : "text-stone/30 group-hover:text-ink/60"
                      }`}
                    >
                      {pillar.word}
                    </h3>
                  </div>

                  {/* Active Pillar Description */}
                  <div
                    className={`overflow-hidden transition-all duration-500 pl-10 sm:pl-12 ${
                      isActive
                        ? "max-h-24 opacity-100 mt-3 sm:mt-4"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <p className="text-sm sm:text-base text-ink/70 font-light max-w-md">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Crossfading Portrait Detail Column (CSS crossfade eliminates SSR/hydration blank image traps) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full max-w-md mx-auto overflow-hidden bg-stone/20">
              {philosophyContent.pillars.map((pillar, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={pillar.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-center filter contrast-[1.02]"
                    />
                    {/* Subtle tonal grading overlay */}
                    <div className="absolute inset-0 bg-ink/5 mix-blend-multiply pointer-events-none" />
                  </div>
                );
              })}

              {/* Photo Caption */}
              <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/90 drop-shadow-sm uppercase pointer-events-none">
                <span>{philosophyContent.studyPrefix}{activePillar.word}</span>
                <span>{philosophyContent.platePrefix}{activeIndex + 1}</span>
              </div>
            </div>

            <p className="text-center lg:text-left text-xs font-mono text-ink/40 tracking-widest mt-4 uppercase">
              {philosophyContent.hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
