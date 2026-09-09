"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { campusContent, CAMPUS_LOCATIONS } from "@/data/content";

export default function CampusSection() {
  const [activeLocationId, setActiveLocationId] = useState<string>("studio");

  const activeLoc =
    CAMPUS_LOCATIONS.find((l) => l.id === activeLocationId) ||
    CAMPUS_LOCATIONS[0];

  return (
    <section
      id="campus"
      className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#F5F1E8] text-[#20231F] border-t border-[#20231F]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#73866C] block mb-2 font-mono">
              {campusContent.eyebrow}
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#20231F] leading-none">
              {campusContent.headingMain} <br />
              <span className="font-serif-title italic font-normal text-[#73866C]">
                {campusContent.headingAccent}
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#20231F]/80 leading-relaxed font-sans">
            {campusContent.description}
          </p>
        </div>

        {/* Location selector pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 mb-8">
          {CAMPUS_LOCATIONS.map((loc) => {
            const isCurrent = loc.id === activeLocationId;
            return (
              <button
                key={loc.id}
                onClick={() => setActiveLocationId(loc.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shrink-0 border ${
                  isCurrent
                    ? "bg-[#73866C] text-[#FFFDF8] border-[#73866C] shadow-md scale-105"
                    : "bg-[#FFFDF8] text-[#20231F]/80 border-[#20231F]/15 hover:border-[#73866C]"
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>

        {/* Main Illustrated Campus Map Stage */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[640px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF8]">
          {/* Base Campus Photography */}
          <Image
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
            alt="Fieldstone School Campus Grounds with green courtyard and trees"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover brightness-90 saturate-[0.85]"
            priority
          />

          {/* Soft atmospheric overlay */}
          <div className="absolute inset-0 bg-[#20231F]/30 backdrop-brightness-[0.92]" />

          {/* Thin Illustrated Hand-Drawn SVG Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Hand-drawn connecting path */}
            <motion.path
              d="M 18 32 C 24 48, 28 60, 34 65 C 42 70, 46 38, 52 28 C 58 20, 60 50, 65 58 C 72 65, 78 45, 82 36 C 85 46, 82 66, 78 75"
              fill="none"
              stroke="#E5B84C"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Waypoint Markers on the Map */}
          {CAMPUS_LOCATIONS.map((loc) => {
            const isCurrent = loc.id === activeLocationId;
            return (
              <div
                key={loc.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                }}
                onClick={() => setActiveLocationId(loc.id)}
              >
                {/* Pulsing indicator */}
                <div className="relative flex items-center justify-center">
                  {isCurrent && (
                    <span className="absolute w-10 h-10 rounded-full bg-[#E5B84C]/40 animate-ping" />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-transform duration-300 shadow-lg ${
                      isCurrent
                        ? "bg-[#E5B84C] text-[#20231F] scale-125 ring-4 ring-[#FFFDF8]"
                        : "bg-[#FFFDF8] text-[#20231F] group-hover:scale-110"
                    }`}
                  >
                    ●
                  </div>

                  {/* Waypoint Label */}
                  <span
                    className={`absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md transition-all ${
                      isCurrent
                        ? "bg-[#20231F] text-[#FFFDF8]"
                        : "bg-[#FFFDF8]/90 text-[#20231F] opacity-80 group-hover:opacity-100"
                    }`}
                  >
                    {loc.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Active Highlighted Location Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:max-w-md z-30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLoc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FFFDF8] p-5 sm:p-6 rounded-2xl shadow-2xl border border-[#20231F]/15"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#73866C]">
                    {campusContent.cardBadge}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#20231F]/60">
                    {campusContent.cardLocationSub}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#20231F]">
                  {activeLoc.name}
                </h3>
                <p className="font-serif-title text-xl sm:text-2xl italic text-[#D76C56] mt-2 font-normal leading-snug">
                  “{activeLoc.sentence}”
                </p>
                <p className="text-xs sm:text-sm text-[#20231F]/80 mt-3 leading-relaxed">
                  {activeLoc.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Human Writing Grid Below Map */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CAMPUS_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setActiveLocationId(loc.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                loc.id === activeLocationId
                  ? "bg-[#FFFDF8] border-[#73866C] shadow-md"
                  : "bg-transparent border-[#20231F]/10 hover:bg-[#FFFDF8]/50"
              }`}
            >
              <h4 className="text-sm font-black uppercase tracking-tight text-[#20231F]">
                {loc.name}
              </h4>
              <p className="font-serif-title text-xs italic text-[#73866C] mt-1 line-clamp-2">
                {loc.sentence}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
