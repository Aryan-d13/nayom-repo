"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { PROCESS_STAGES, processSectionContent } from "@/data/content";

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Monitor scroll progression within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Automatically update step as user scrolls through the container
  scrollYProgress.on("change", (val) => {
    if (val < 0.25) setActiveStepIndex(0);
    else if (val < 0.5) setActiveStepIndex(1);
    else if (val < 0.75) setActiveStepIndex(2);
    else setActiveStepIndex(3);
  });

  const activeStage = PROCESS_STAGES[activeStepIndex];

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-28 md:py-40 px-6 md:px-12 bg-ink text-chalk border-t border-ink selection:bg-terracotta selection:text-chalk"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-terracotta" />
            <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
              {processSectionContent.sectionNumber}
            </span>
          </div>

          <h2 className="font-sans font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] uppercase text-chalk">
            {processSectionContent.heading}
          </h2>

          <p className="font-serif italic text-2xl sm:text-4xl text-stone mt-3">
            {processSectionContent.serifSubtitle}
          </p>
        </div>

        {/* Desktop Layout: Large Words on Left, Changing Sentence & Stage Details on Right */}
        <div className="hidden md:grid md:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Huge interactive stage words */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            {PROCESS_STAGES.map((stage, idx) => {
              const isActive = activeStepIndex === idx;

              return (
                <button
                  key={stage.title}
                  onClick={() => setActiveStepIndex(idx)}
                  className="text-left group flex items-baseline gap-6 transition-all duration-300 py-3 cursor-pointer focus:outline-hidden"
                >
                  <span
                    className={`font-mono text-sm transition-colors duration-300 ${
                      isActive ? "text-terracotta" : "text-chalk/20 group-hover:text-chalk/50"
                    }`}
                  >
                    {stage.step}
                  </span>

                  <span
                    className={`font-sans font-medium tracking-tight text-4xl sm:text-6xl lg:text-7xl uppercase transition-all duration-300 ${
                      isActive
                        ? "text-chalk scale-100 translate-x-1"
                        : "text-chalk/25 group-hover:text-chalk/50"
                    }`}
                  >
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage Content */}
          <div className="md:col-span-6 sticky top-36 pt-4 border-l border-chalk/10 pl-8 lg:pl-12 min-h-[320px] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-terracotta tracking-widest uppercase">
              <span>
                {processSectionContent.stagePrefix} {activeStage.step}{" "}
                {processSectionContent.stageSuffix}
              </span>
              <span>•</span>
              <span>{activeStage.title}</span>
            </div>

            {/* Changing short sentence */}
            <motion.div
              key={activeStage.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3
                className={`font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug ${
                  activeStage.title === "LIVE" ? "text-chalk italic font-semibold" : "text-stone"
                }`}
              >
                {activeStage.sentence}
              </h3>

              <p className="mt-6 font-sans text-sm sm:text-base text-chalk/70 leading-relaxed max-w-lg">
                {activeStage.expanded}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout: Simple vertical progression */}
        <div className="md:hidden flex flex-col space-y-12">
          {PROCESS_STAGES.map((stage) => (
            <div key={stage.title} className="border-b border-chalk/15 pb-8">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-xs text-terracotta">{stage.step}</span>
                <h3 className="font-sans text-4xl font-medium text-chalk tracking-tight uppercase">
                  {stage.title}
                </h3>
              </div>
              <p
                className={`font-serif text-xl ${
                  stage.title === "LIVE" ? "text-chalk italic font-medium" : "text-stone"
                }`}
              >
                {stage.sentence}
              </p>
              <p className="mt-3 font-sans text-xs text-chalk/70 leading-relaxed">
                {stage.expanded}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
