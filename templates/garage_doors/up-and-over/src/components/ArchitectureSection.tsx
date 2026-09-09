"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { architectureContent, ARCH_POINTS, ArchitecturePoint } from "@/data/content";

export default function ArchitectureSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Gentle auto-cycle every 6.5s unless clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ARCH_POINTS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeStep]);

  const current: ArchitecturePoint = ARCH_POINTS[activeStep];

  return (
    <section
      id="architecture"
      className="relative w-full bg-[#202321] text-[#F5F1E8] py-24 sm:py-36 overflow-hidden border-b border-[#111311]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#A85F45] uppercase block mb-2">
            {architectureContent.sectionTag}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F5F1E8]">
            {architectureContent.titlePart1} <br />
            <span className="font-normal italic">{architectureContent.titlePart2}</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#D4D0C7]/80 mt-4 leading-relaxed max-w-lg">
            {architectureContent.description}
          </p>
        </div>

        {/* The Architectural Elevation Canvas */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#111311] overflow-hidden border border-white/10 shadow-2xl">
          {/* Base Facade Photograph */}
          <div className="absolute inset-0">
            <Image
              src={architectureContent.image.src}
              alt={architectureContent.image.alt}
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Fine architectural drafting tint */}
            <div className="absolute inset-0 bg-[#111311]/40 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Thin Architectural Dimension Lines SVG Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            {/* Subtle Blueprint Grid Lines */}
            <line
              x1="0"
              y1="460"
              x2="1000"
              y2="460"
              stroke="#D4D0C7"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.35"
            />
            <line
              x1="320"
              y1="0"
              x2="320"
              y2="700"
              stroke="#D4D0C7"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.35"
            />

            {/* Architectural Pointer Lines to Facade Features */}
            {/* Door Line */}
            <g
              className="transition-all duration-700"
              opacity={activeStep === 0 || activeStep === 2 || activeStep === 3 ? 1 : 0.25}
            >
              <polyline
                points="180,240 280,480 340,560"
                fill="none"
                stroke={activeStep === 0 ? "#A85F45" : "#D4D0C7"}
                strokeWidth={activeStep === 0 ? "1.75" : "0.75"}
              />
              <circle
                cx="340"
                cy="560"
                r={activeStep === 0 ? "4" : "2"}
                fill={activeStep === 0 ? "#A85F45" : "#D4D0C7"}
              />
            </g>

            {/* Siding / Color Line */}
            <g
              className="transition-all duration-700"
              opacity={activeStep === 1 || activeStep === 3 ? 1 : 0.25}
            >
              <polyline
                points="820,180 720,290 620,380"
                fill="none"
                stroke={activeStep === 1 ? "#A85F45" : "#D4D0C7"}
                strokeWidth={activeStep === 1 ? "1.75" : "0.75"}
              />
              <circle
                cx="620"
                cy="380"
                r={activeStep === 1 ? "4" : "2"}
                fill={activeStep === 1 ? "#A85F45" : "#D4D0C7"}
              />
            </g>

            {/* Roofline Datum */}
            <g
              className="transition-all duration-700"
              opacity={activeStep === 2 || activeStep === 3 ? 1 : 0.25}
            >
              <polyline
                points="340,160 520,160 740,160"
                fill="none"
                stroke={activeStep === 2 ? "#A85F45" : "#D4D0C7"}
                strokeWidth={activeStep === 2 ? "1.5" : "0.5"}
                strokeDasharray="3 3"
              />
            </g>
          </svg>

          {/* Dynamic Single-Label Architectural Box Overlay (Only one label at a time) */}
          <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-8 max-w-lg z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className="bg-[#111311]/85 backdrop-blur-md p-5 sm:p-6 border-l-2 border-[#A85F45] text-[#F5F1E8]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#A85F45]">
                    {architectureContent.dimensionLabel} 0{activeStep + 1}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4D0C7]/60">
                    {architectureContent.facadeStudyLabel}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#F5F1E8] mb-1">
                  {current.label}
                </h3>

                <p className="font-serif italic text-sm text-[#D4D0C7] mb-3">
                  {current.subtitle}
                </p>

                <p className="text-xs text-[#D4D0C7]/90 leading-relaxed font-sans">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Right Step Indicators */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            {ARCH_POINTS.map((pt, idx) => (
              <button
                key={pt.id}
                onClick={() => setActiveStep(idx)}
                className={`w-9 h-8 border text-[11px] font-mono transition-all ${
                  activeStep === idx
                    ? "border-[#A85F45] bg-[#A85F45] text-[#F5F1E8]"
                    : "border-white/20 bg-[#111311]/70 text-[#D4D0C7] hover:border-white/60"
                }`}
                aria-label={`Show ${pt.label}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural Principles Footnote */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 text-xs font-mono text-[#D4D0C7]/70">
          {architectureContent.footnotes.map((fn) => (
            <div key={fn.label}>
              <p className="text-[#F5F1E8] uppercase tracking-wider mb-1">{fn.label}</p>
              <p className="leading-relaxed">{fn.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
