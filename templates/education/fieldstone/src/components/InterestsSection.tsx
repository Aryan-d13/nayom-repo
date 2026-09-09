"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { interestsContent, INTERESTS, type Interest } from "@/data/content";

export default function InterestsSection() {
  const [activeInterest, setActiveInterest] = useState<Interest | null>(
    INTERESTS[1] // Default to SCIENCE
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Approximate 2D coordinates for constellation placement on desktop
  const coordinates: Record<string, { x: number; y: number }> = {
    music: { x: 12, y: 15 },
    science: { x: 42, y: 10 },
    sport: { x: 74, y: 18 },
    art: { x: 18, y: 50 },
    books: { x: 48, y: 44 },
    building: { x: 78, y: 52 },
    drama: { x: 26, y: 82 },
    outside: { x: 62, y: 80 },
  };

  const current = activeInterest || INTERESTS[1];

  return (
    <section
      id="interests"
      className="relative min-h-[95vh] py-24 px-6 sm:px-8 lg:px-12 bg-[#FFFDF8] text-[#20231F] border-t border-[#20231F]/10 overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#D76C56] block mb-3">
            {interestsContent.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#20231F] uppercase leading-[0.95]">
            {interestsContent.headingMain} <br />
            <span className="font-serif-title italic font-normal text-[#4E7FA3] normal-case">
              {interestsContent.headingAccent}
            </span>
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base text-[#20231F]/75 leading-relaxed">
          {interestsContent.description}
        </p>
      </div>

      {/* Desktop Interactive Constellation Canvas */}
      <div className="hidden lg:block relative max-w-7xl mx-auto h-[600px] border border-[#20231F]/10 rounded-2xl bg-[#FBF9F4] p-8 overflow-hidden">
        {/* Subtle Constellation grid / connecting faint lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="18%"
            y1="22%"
            x2="45%"
            y2="18%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="45%"
            y1="18%"
            x2="78%"
            y2="24%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="24%"
            y1="56%"
            x2="52%"
            y2="50%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="52%"
            y1="50%"
            x2="82%"
            y2="58%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="32%"
            y1="88%"
            x2="66%"
            y2="86%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="45%"
            y1="18%"
            x2="52%"
            y2="50%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <line
            x1="52%"
            y1="50%"
            x2="66%"
            y2="86%"
            stroke="#20231F"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
        </svg>

        {/* Floating Active Photograph Preview Window */}
        <div className="absolute right-12 bottom-10 z-20 pointer-events-none w-80 xl:w-96">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FFFDF8] p-4 rounded-xl shadow-2xl border-2 border-[#20231F]/15"
              >
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={current.image}
                    alt={current.alt}
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                  <span
                    className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-[#FFFDF8]"
                    style={{ backgroundColor: current.color }}
                  >
                    {current.name}
                  </span>
                </div>
                <p className="font-serif-title text-base italic text-[#20231F] leading-snug">
                  “{current.quote}”
                </p>
                <p className="text-xs text-[#20231F]/70 mt-1.5 font-medium">
                  {current.subtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Constellation Nodes */}
        {INTERESTS.map((item) => {
          const isSelected = (hoveredId || current?.id) === item.id;
          const pos = coordinates[item.id] || { x: 50, y: 50 };

          // Repulsion calculation: if something else is hovered, push subtly away
          let pushX = 0;
          let pushY = 0;
          if (hoveredId && hoveredId !== item.id) {
            const hPos = coordinates[hoveredId];
            if (hPos) {
              const dx = pos.x - hPos.x;
              const dy = pos.y - hPos.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              pushX = (dx / dist) * 14;
              pushY = (dy / dist) * 14;
            }
          }

          return (
            <motion.div
              key={item.id}
              className="absolute z-10 select-none cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                x: pushX,
                y: pushY,
                scale: isSelected ? 1.12 : 1,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onMouseEnter={() => {
                setHoveredId(item.id);
                setActiveInterest(item);
              }}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveInterest(item)}
              tabIndex={0}
              role="button"
              aria-label={`Explore ${item.name}`}
              onFocus={() => {
                setHoveredId(item.id);
                setActiveInterest(item);
              }}
              onBlur={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-2 group">
                <span
                  className="w-3.5 h-3.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    backgroundColor: isSelected ? item.color : "#20231F",
                  }}
                />
                <span
                  className={`text-2xl xl:text-4xl font-black uppercase tracking-tight transition-colors duration-200 ${
                    isSelected
                      ? "underline decoration-4 underline-offset-8"
                      : "text-[#20231F]/80 group-hover:text-[#20231F]"
                  }`}
                  style={{
                    color: isSelected ? item.color : undefined,
                    textDecorationColor: isSelected ? item.color : undefined,
                  }}
                >
                  {item.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile & Tablet Responsive View: Interactive Vertical Cards */}
      <div className="lg:hidden flex flex-col gap-4 max-w-xl mx-auto">
        {INTERESTS.map((item) => {
          const isOpen = current?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveInterest(isOpen ? null : item)}
              className="border border-[#20231F]/15 rounded-xl bg-[#FBF9F4] p-5 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#20231F]">
                    {item.name}
                  </h3>
                </div>
                <span className="text-lg font-bold text-[#20231F]/60">
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-[#20231F]/10 flex flex-col gap-3"
                >
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                  </div>
                  <p className="font-serif-title text-base italic text-[#20231F]">
                    “{item.quote}”
                  </p>
                  <p className="text-xs text-[#20231F]/70 font-medium">
                    {item.subtitle}
                  </p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
