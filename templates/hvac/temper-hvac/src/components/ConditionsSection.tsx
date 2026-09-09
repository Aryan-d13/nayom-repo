"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemperature } from "@/context/TemperatureContext";
import { ArrowRight, Thermometer, Wind } from "lucide-react";

import { conditionsContent } from "@/data/content";

const CONDITIONS = conditionsContent.conditions;

export default function ConditionsSection() {
  const { setTemperatureState, openBooking } = useTemperature();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCondition = CONDITIONS[activeIndex];

  // Sync with global temperature indicator
  useEffect(() => {
    setTemperatureState(activeCondition.temp, activeCondition.id.toUpperCase());
  }, [activeIndex, activeCondition, setTemperatureState]);

  // Optional: Allow scroll wheel to gently cycle inside section when pinned or hovered
  const handleSelectCondition = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="conditions"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden transition-colors duration-1000 py-20 px-6 sm:px-8 lg:px-12 text-white"
    >
      {/* Dynamic Environmental Full-Screen Background */}
      <motion.div
        key={activeCondition.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-b ${activeCondition.bgGradient} z-0`}
        style={{
          filter: activeCondition.visualFilter,
        }}
      />

      {/* Atmospheric Texture / Haze / Light Field */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          backgroundImage: activeCondition.ambientTexture,
        }}
      />

      {/* Subtle architectural noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* Top Section Header & Environmental State Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/15 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-cream/70 font-mono">
              {conditionsContent.headerOverline}
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-cream font-medium">
              {conditionsContent.headerTitle}
            </p>
          </div>

          {/* Direct Interactive State Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {CONDITIONS.map((cond, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => handleSelectCondition(idx)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-white text-ink font-semibold shadow-lg scale-105"
                      : "bg-black/25 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{cond.title.replace(".", "")}</span>
                  {isSelected && (
                    <span className="font-mono text-[9px] opacity-75">
                      {cond.temp}°
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Centerpiece: Large Centered State Typography & Environmental Shift */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto text-center py-16 sm:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCondition.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Giant Environmental Heading */}
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-sans font-black tracking-tight leading-none mb-6">
              {activeCondition.title}
            </h2>

            {/* Tactile Sensory Observation */}
            <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-cream/90 max-w-2xl font-light mb-6">
              {activeCondition.subtext}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 border border-white/10 text-xs font-mono tracking-widest text-cream/80">
              <Thermometer className="w-3.5 h-3.5 text-sand" />
              <span>{activeCondition.sensoryNote}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tactile next/prev controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : CONDITIONS.length - 1))
            }
            className="p-3 rounded-full border border-white/20 text-cream hover:bg-white hover:text-ink transition-colors cursor-pointer text-xs"
            aria-label="Previous condition"
          >
            ←
          </button>
          <div className="flex gap-2">
            {CONDITIONS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev < CONDITIONS.length - 1 ? prev + 1 : 0))
            }
            className="p-3 rounded-full border border-white/20 text-cream hover:bg-white hover:text-ink transition-colors cursor-pointer text-xs"
            aria-label="Next condition"
          >
            →
          </button>
        </div>
      </div>

      {/* Bottom Anchor & CTA */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pb-6">
        <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-base sm:text-lg text-cream/90 font-light text-center sm:text-left max-w-xl">
            {conditionsContent.footerQuote}
          </p>

          <button
            type="button"
            onClick={() => openBooking(`Condition check: ${activeCondition.title}`)}
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-ink hover:bg-sand transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold shadow-md cursor-pointer shrink-0"
          >
            <span>{conditionsContent.bookCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
