"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WHAT_WE_KEEP_CONTENT } from "@/data/content";

export default function WhatWeKeep() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = WHAT_WE_KEEP_CONTENT.items[activeIndex];

  return (
    <section
      id="what-we-keep"
      className="py-24 sm:py-32 md:py-40 bg-warm-white border-t border-dust/30"
      aria-label="What We Keep"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Large Headline */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold mb-4"
          >
            {WHAT_WE_KEEP_CONTENT.sectionTag}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-ink uppercase max-w-4xl"
          >
            {WHAT_WE_KEEP_CONTENT.headlineLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < WHAT_WE_KEEP_CONTENT.headlineLines.length - 1 && <br />}
              </span>
            ))}
          </motion.h2>
        </div>

        {/* Editorial Two-Column Detail Presentation (NO CARDS, NO ICONS, NO STATS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Interactive List of Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6 sm:space-y-8" role="tablist" aria-label="Original House Details">
              {WHAT_WE_KEEP_CONTENT.items.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => setActiveIndex(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`detail-panel-${item.id}`}
                      id={`detail-tab-${item.id}`}
                      className="group text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-terracotta cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-extrabold uppercase transition-colors duration-200 ${
                            isActive
                              ? "text-ink"
                              : "text-dust hover:text-ink/60"
                          } ${idx === 3 ? "normal-case font-serif italic text-3xl sm:text-4xl tracking-normal text-terracotta/90" : ""}`}
                        >
                          {item.title}
                        </span>

                        <span className="font-mono text-xs text-dust/80">
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Subtle Terracotta Underline on Active Item */}
                      {isActive && (
                        <motion.div
                          layoutId="terracottaUnderline"
                          className="h-[2px] bg-terracotta mt-2 w-full origin-left"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>

                    {/* Active item textual narrative (appears directly below active tab) */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          id={`detail-panel-${item.id}`}
                          role="tabpanel"
                          aria-labelledby={`detail-tab-${item.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-4 overflow-hidden"
                        >
                          <p className="text-xs uppercase tracking-[0.16em] text-moss font-semibold mb-2">
                            {item.subtitle}
                          </p>
                          <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Mobile / Screen-reader hint */}
            <div className="text-[11px] font-mono tracking-widest text-dust uppercase pt-4">
              {WHAT_WE_KEEP_CONTENT.instructionHint}
            </div>
          </div>

          {/* Right: Dynamic Photograph corresponding to active detail */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-parchment shadow-[0_15px_40px_-15px_rgba(35,35,33,0.12)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter saturate-[0.9] contrast-[1.04]"
                  />

                  {/* Soft edge tone wash */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-warm-white pointer-events-none">
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-warm-white/80 block mb-1">
                        {WHAT_WE_KEEP_CONTENT.preservedBadge}
                      </span>
                      <span className="font-serif italic text-xl sm:text-2xl text-warm-white">
                        {activeItem.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono tracking-widest text-warm-white/70">
                      {WHAT_WE_KEEP_CONTENT.locationBadge}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Underneath: Strong Philosophical Editorial Statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-24 sm:mt-32 pt-16 border-t border-dust/40 max-w-3xl"
        >
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink leading-snug font-normal">
            {WHAT_WE_KEEP_CONTENT.subtextFirst}
          </p>
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-terracotta mt-3 leading-snug font-normal">
            {WHAT_WE_KEEP_CONTENT.subtextSecond}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
