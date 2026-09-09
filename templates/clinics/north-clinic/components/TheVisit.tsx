"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { theVisitContent, VisitMoment } from "@/data/content";

export default function TheVisit() {
  const [activeMomentId, setActiveMomentId] = useState<string>("arrive");

  const activeIndex = theVisitContent.moments.findIndex(
    (m) => m.id === activeMomentId
  );
  const activeMoment: VisitMoment =
    theVisitContent.moments[activeIndex >= 0 ? activeIndex : 0];

  return (
    <section
      id="visit"
      className="relative py-20 sm:py-28 lg:py-36 bg-ivory-light text-ink border-b border-dust"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/50 font-sans font-medium">
            {theVisitContent.overline}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-light tracking-[-0.02em] uppercase font-sans text-ink">
            {theVisitContent.headline}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink/70 font-sans leading-relaxed">
            {theVisitContent.description}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Column 1: Sequential Steps Flow */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative flex flex-col gap-4">
              {theVisitContent.moments.map((moment) => {
                const isActive = moment.id === activeMomentId;

                return (
                  <button
                    key={moment.id}
                    type="button"
                    onClick={() => setActiveMomentId(moment.id)}
                    aria-selected={isActive}
                    role="tab"
                    className={`text-left w-full transition-all duration-300 rounded-sm cursor-pointer ${
                      isActive
                        ? "bg-white border-l-4 border-l-sage border-y border-r border-dust/80 shadow-sm p-6 sm:p-7"
                        : "bg-white/40 border border-dust/70 hover:bg-white/80 hover:border-dust-dark p-5 sm:p-6 group"
                    }`}
                  >
                    {/* Step index and action word */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`font-mono text-xs tracking-widest transition-colors ${
                            isActive
                              ? "text-sage font-semibold"
                              : "text-ink/40 group-hover:text-ink/70"
                          }`}
                        >
                          {moment.stepNumber}
                        </span>
                        <h3
                          className={`text-xl sm:text-2xl font-light uppercase tracking-tight transition-colors ${
                            isActive
                              ? "text-ink font-normal"
                              : "text-ink/70 group-hover:text-ink"
                          }`}
                        >
                          {moment.word}
                        </h3>
                      </div>

                      {/* Status indicator dot */}
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="hidden sm:inline-block text-[10px] uppercase font-sans tracking-[0.2em] text-sage font-medium">
                            CURRENT STEP
                          </span>
                        )}
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-sage scale-100 ring-4 ring-sage/20"
                              : "bg-dust-dark group-hover:bg-ink/40 scale-75"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Emotive serif headline */}
                    <p
                      className={`mt-2.5 text-base sm:text-lg font-serif italic transition-colors ${
                        isActive
                          ? "text-ink font-normal"
                          : "text-ink/60 group-hover:text-ink/80"
                      }`}
                    >
                      {moment.line}
                    </p>

                    {/* Expanded details for active moment */}
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 pt-3 border-t border-dust/50 text-sm sm:text-base text-ink/75 font-sans leading-relaxed">
                          {moment.sub}
                        </p>

                        {/* Experience tags */}
                        {moment.tags && moment.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {moment.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-sans tracking-wide uppercase px-2.5 py-1 bg-sage-tint text-ink-muted border border-sage-soft/70 rounded-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <p className="mt-2 text-xs sm:text-sm text-ink/50 font-sans line-clamp-1 group-hover:text-ink/70 transition-colors">
                        {moment.sub}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Photographic Stage (Clean, Unobstructed, Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-sm border border-dust/80 shadow-sm">
              {/* Top metadata strip */}
              <div className="flex items-center justify-between pb-3.5 border-b border-dust/60 text-xs font-sans">
                <span className="uppercase tracking-[0.2em] text-ink/50 font-medium">
                  PHASE 0{activeIndex + 1} OF 0{theVisitContent.moments.length}
                </span>
                <span className="uppercase tracking-[0.18em] text-sage font-medium">
                  {activeMoment.word}
                </span>
              </div>

              {/* Photographic viewport — totally clean, no badge overlays */}
              <div className="relative mt-3.5 w-full aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden bg-dust-light">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMoment.id}
                    initial={{ opacity: 0, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeMoment.image}
                      alt={activeMoment.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Architectural context & details below the photo */}
              <div className="mt-4 pt-4 border-t border-dust/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-sans">
                  <span className="uppercase tracking-[0.15em] text-ink/50 font-medium">
                    {activeMoment.spaceLabel}
                  </span>
                  <span className="text-ink/70 italic sm:not-italic font-sans">
                    {activeMoment.spaceDetail}
                  </span>
                </div>

                {/* Serene clinic philosophy quote */}
                <p className="text-sm sm:text-base font-serif italic text-ink/80 pt-1 leading-relaxed">
                  {activeMoment.quote}
                </p>

                {/* Direct quick jump dots */}
                <div className="pt-2 flex items-center justify-between border-t border-dust/40 text-[11px] text-ink/50 font-sans">
                  <span className="uppercase tracking-[0.15em]">
                    THE VISIT TIMELINE
                  </span>
                  <div className="flex items-center gap-1.5">
                    {theVisitContent.moments.map((m, idx) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMomentId(m.id)}
                        aria-label={`Jump to step ${idx + 1}: ${m.word}`}
                        className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                          m.id === activeMomentId
                            ? "w-7 bg-sage"
                            : "w-2 bg-dust-dark hover:bg-ink/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
