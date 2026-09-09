"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dayContent, DAY_MOMENTS } from "@/data/content";

export default function DaySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const current = DAY_MOMENTS[activeIndex];

  return (
    <section
      id="day"
      className="relative transition-colors duration-700 py-24 sm:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden"
      style={{
        backgroundColor: current.bgColor,
        color: current.textColor,
      }}
    >
      {/* Section Top Header & Timeline Scrubber */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-current/15">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] opacity-75 block mb-2 font-mono">
              {dayContent.eyebrow}
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none">
              {dayContent.headingMain} <br />
              <span className="font-serif-title italic font-normal">
                {dayContent.headingAccent}
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base opacity-85 leading-relaxed font-sans">
            {dayContent.description}
          </p>
        </div>

        {/* Time Stepper Bar */}
        <div className="mt-8 flex items-center justify-between overflow-x-auto no-scrollbar gap-3 sm:gap-4 pb-4">
          {DAY_MOMENTS.map((moment, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={moment.time}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 min-w-[120px] sm:min-w-[140px] text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-current/10 border-current shadow-md scale-[1.02]"
                    : "border-current/15 opacity-60 hover:opacity-100"
                }`}
                aria-label={`Jump to ${moment.time} ${moment.title}`}
              >
                <div className="text-xs font-mono font-bold tracking-wider">
                  {moment.time}
                </div>
                <div className="text-sm sm:text-base font-black uppercase tracking-tight mt-0.5">
                  {moment.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Stage: Distinct Visual Composition per Moment */}
        <div className="mt-14 relative min-h-[520px] lg:min-h-[580px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.time}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Conditional Compositions based on moment */}
              {activeIndex === 0 && (
                /* 8:07 ARRIVE — Left heavy editorial with right photo window */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6">
                    <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter opacity-20 select-none">
                      {current.time}
                    </div>
                    <h3 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight -mt-8 sm:-mt-12">
                      {current.title}
                    </h3>
                    <p className="font-serif-title text-2xl sm:text-3xl italic mt-4 opacity-95">
                      “{current.tagline}”
                    </p>
                    <p className="text-base sm:text-lg mt-6 opacity-85 leading-relaxed max-w-lg">
                      {current.description}
                    </p>
                    <div className="mt-8 inline-flex items-center gap-2 font-handwritten text-xl opacity-90">
                      <span>✦ {current.detail}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-current/15 rotate-1">
                      <Image
                        src={current.image}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 1 && (
                /* 9:18 MAKE — Centered photograph flanked by bold maker typography */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 order-2 lg:order-1">
                    <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-current/20 -rotate-2">
                      <Image
                        src={current.image}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-7 order-1 lg:order-2 pl-0 lg:pl-6">
                    <span className="font-mono text-xs sm:text-sm uppercase tracking-widest px-3 py-1 bg-current/10 rounded-full font-bold">
                      {current.time} AM · DESIGN BARN
                    </span>
                    <h3 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight mt-4">
                      {current.title}
                    </h3>
                    <p className="font-serif-title text-2xl sm:text-4xl italic mt-3 opacity-95 leading-tight">
                      {current.tagline}
                    </p>
                    <p className="text-base sm:text-lg mt-6 opacity-90 leading-relaxed max-w-xl">
                      {current.description}
                    </p>
                    <div className="mt-8 p-4 bg-current/10 rounded-xl max-w-md border border-current/15">
                      <span className="font-mono text-xs uppercase font-bold tracking-wider block opacity-75">
                        Maker Log Observation
                      </span>
                      <p className="font-handwritten text-xl mt-1">
                        {current.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 2 && (
                /* 11:42 QUESTION — Circle seminar layout with big typography */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7">
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase opacity-75">
                      {current.time} · HUMANITIES & REASONING
                    </span>
                    <h3 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-tight mt-3">
                      {current.title}
                    </h3>
                    <blockquote className="font-serif-title text-2xl sm:text-4xl italic mt-4 leading-snug border-l-4 border-current pl-6 my-6">
                      “{current.tagline}”
                    </blockquote>
                    <p className="text-base sm:text-lg opacity-90 leading-relaxed max-w-xl">
                      {current.description}
                    </p>
                    <p className="font-mono text-xs mt-6 opacity-75 tracking-wider uppercase">
                      Discussion note: {current.detail}
                    </p>
                  </div>

                  <div className="lg:col-span-5 relative">
                    <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-current/20 rotate-2">
                      <Image
                        src={current.image}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 3 && (
                /* 1:16 PLAY — High-energy diagonal composition */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 order-2 lg:order-1 relative">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-current/20 -rotate-1">
                      <Image
                        src={current.image}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 order-1 lg:order-2">
                    <div className="text-6xl sm:text-8xl font-black font-mono tracking-tighter opacity-20">
                      {current.time}
                    </div>
                    <h3 className="text-5xl sm:text-7xl font-black uppercase tracking-tight -mt-6">
                      {current.title}
                    </h3>
                    <p className="font-serif-title text-2xl sm:text-3xl italic mt-4 opacity-95">
                      {current.tagline}
                    </p>
                    <p className="text-base sm:text-lg mt-6 opacity-85 leading-relaxed">
                      {current.description}
                    </p>
                    <div className="mt-6 font-handwritten text-2xl opacity-90">
                      ✦ {current.detail}
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 4 && (
                /* 2:48 DISCOVER — Lab microscope curiosity moment on warm paper */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#4E7FA3]">
                      {current.time} · SCIENCE WING
                    </span>
                    <h3 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-tight mt-2 text-[#20231F]">
                      {current.title}
                    </h3>
                    <p className="font-serif-title text-2xl sm:text-3xl italic text-[#4E7FA3] mt-4">
                      “{current.tagline}”
                    </p>
                    <p className="text-base sm:text-lg text-[#20231F]/80 mt-6 leading-relaxed max-w-lg">
                      {current.description}
                    </p>
                    <div className="mt-8 inline-block bg-[#4E7FA3]/10 px-4 py-2 rounded-lg font-mono text-xs text-[#20231F] font-semibold">
                      Observation: {current.detail}
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#20231F]/15 rotate-1 bg-white p-2">
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <Image
                          src={current.image}
                          alt={current.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 600px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndex === 5 && (
                /* 3:31 GO HOME — Evening dusk ink atmosphere */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6 order-2 lg:order-1">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFFDF8]/20 -rotate-1">
                      <Image
                        src={current.image}
                        alt={current.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 order-1 lg:order-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E5B84C]">
                      {current.time} PM · GREENWOOD GATE
                    </span>
                    <h3 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-tight mt-2 text-[#FFFDF8]">
                      {current.title}
                    </h3>
                    <p className="font-serif-title text-2xl sm:text-3xl italic text-[#E5B84C] mt-4">
                      {current.tagline}
                    </p>
                    <p className="text-base sm:text-lg text-[#FFFDF8]/85 mt-6 leading-relaxed max-w-lg">
                      {current.description}
                    </p>
                    <p className="font-handwritten text-2xl text-[#E5B84C] mt-6">
                      ✦ {current.detail}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows for convenient stepping */}
        <div className="mt-12 flex items-center justify-between border-t border-current/15 pt-6">
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : DAY_MOMENTS.length - 1
              )
            }
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-75 transition-opacity cursor-pointer py-2 px-3 rounded-lg border border-current/20"
            aria-label="Previous day moment"
          >
            <span>←</span>
            <span>{dayContent.stepperLabels.prev}</span>
          </button>

          <span className="font-mono text-xs opacity-75 font-semibold">
            {activeIndex + 1} of {DAY_MOMENTS.length} {dayContent.stepperLabels.indicator}
          </span>

          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev < DAY_MOMENTS.length - 1 ? prev + 1 : 0
              )
            }
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-75 transition-opacity cursor-pointer py-2 px-3 rounded-lg border border-current/20"
            aria-label="Next day moment"
          >
            <span>{dayContent.stepperLabels.next}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
