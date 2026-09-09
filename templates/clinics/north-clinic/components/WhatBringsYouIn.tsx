"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { whatBringsYouInContent } from "@/data/content";

export default function WhatBringsYouIn() {
  const [activeId, setActiveId] = useState<string>("checkup");

  const activeItem =
    whatBringsYouInContent.concerns.find((item) => item.id === activeId) ||
    whatBringsYouInContent.concerns[0];

  return (
    <section
      id="approach"
      className="relative py-28 md:py-40 bg-[#DCE3DA] text-ink overflow-hidden transition-colors duration-700 select-none"
    >
      {/* Organic Oval Photographic Aperture in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-[340px] sm:w-[480px] md:w-[620px] lg:w-[740px] aspect-[4/3] max-w-[85vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden rounded-[46%_54%_50%_50%_/_48%_46%_54%_52%] shadow-inner"
            >
              <Image
                src={activeItem.image}
                alt={activeItem.alt}
                fill
                sizes="(max-width: 768px) 85vw, 650px"
                className="object-cover object-center filter saturate-[0.85] contrast-[0.95]"
              />
              <div className="absolute inset-0 bg-[#DCE3DA]/30 mix-blend-color" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10">
        {/* Section Overline */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/60 font-sans font-medium">
            {whatBringsYouInContent.overline}
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-light tracking-[-0.02em] uppercase font-sans text-ink">
            {whatBringsYouInContent.headline}
          </h2>
        </div>

        {/* Interactive List */}
        <div className="max-w-3xl mx-auto flex flex-col gap-5 sm:gap-7 py-4">
          {whatBringsYouInContent.concerns.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`group relative text-left py-4 px-5 sm:px-8 transition-all duration-300 rounded-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-white/40 backdrop-blur-[2px]"
                    : "hover:bg-white/20"
                }`}
                aria-pressed={isActive}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <span
                    className={`text-2xl sm:text-3xl md:text-4xl font-light tracking-tight transition-colors duration-300 ${
                      isActive
                        ? "text-ink font-normal"
                        : "text-ink/60 group-hover:text-ink/80"
                    }`}
                  >
                    {item.text}
                  </span>

                  <span
                    className={`text-xs tracking-[0.15em] uppercase font-sans transition-opacity duration-300 ${
                      isActive ? "text-ink/70 opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                  >
                    {item.context}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* The Emotional Core of the Page */}
        <div className="mt-16 sm:mt-24 text-center pt-8 border-t border-ink/15 max-w-xl mx-auto">
          <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-ink/90 font-normal leading-relaxed">
            {whatBringsYouInContent.emotionalQuote}
          </p>
        </div>
      </div>
    </section>
  );
}
