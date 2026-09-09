"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Compass } from "lucide-react";
import { somethingsOffContent } from "@/data/content";

interface SomethingsOffProps {
  onOpenBooking: (service?: string) => void;
}

const STATES = somethingsOffContent.states;

export default function SomethingsOff({ onOpenBooking }: SomethingsOffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStateIndex, setActiveStateIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Automatically update state based on scroll progression
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.28) {
        setActiveStateIndex(0); // LOW PRESSURE
      } else if (latest < 0.52) {
        setActiveStateIndex(1); // TOO MUCH WATER
      } else if (latest < 0.76) {
        setActiveStateIndex(2); // SOMETHING'S OFF
      } else {
        setActiveStateIndex(3); // BACK TO NORMAL
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const currentState = STATES[activeStateIndex];

  return (
    <div
      id="pressure"
      ref={containerRef}
      className="relative h-[240vh] bg-[#17252A] text-[#FFFDF8] architectural-grid-dark selection:bg-[#68B8C3] selection:text-[#17252A]"
    >
      {/* Sticky Full-Viewport Experience */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Top Header Row */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#68B8C3]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#DDF0EC]/60">
              {somethingsOffContent.kicker}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {STATES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStateIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeStateIndex === idx
                    ? "bg-[#68B8C3] scale-125 ring-4 ring-[#68B8C3]/30"
                    : "bg-[#FFFDF8]/20 hover:bg-[#FFFDF8]/50"
                }`}
                aria-label={`Jump to ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Central Stage: Metaphorical Pressure Circle + Narrative Side-by-Side */}
        <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10">
          {/* Left Column: Large Metaphorical Water Pressure Circle (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] relative">
            {/* Concentric harmonic guide rings */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#FFFDF8]/5 pointer-events-none" />
            <div className="absolute w-52 h-52 sm:w-68 sm:h-68 rounded-full border border-[#68B8C3]/10 pointer-events-none" />

            {/* The Dynamic Water Pressure Circle */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={`relative rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-700 ${currentState.sizeClass} ${currentState.shapeStyle}`}
            >
              {/* Inner core pulse */}
              <div className="w-4 h-4 rounded-full bg-[#FFFDF8] opacity-80" />

              {/* Water droplet ripples */}
              {activeStateIndex === 3 && (
                <div className="absolute inset-0 rounded-full border border-[#68B8C3]/60 animate-ping opacity-30" />
              )}
            </motion.div>

            {/* Current State Name Badge */}
            <motion.div
              key={currentState.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mt-8 text-center"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-wider text-[#68B8C3] uppercase">
                {currentState.title}
              </span>
              <p className="text-xs text-[#DDF0EC]/70 font-mono mt-1 max-w-xs mx-auto">
                {currentState.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Right Column: Grounded Human Narrative (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#68B8C3] font-semibold mb-3">
              {somethingsOffContent.sectionTag}
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#FFFDF8] leading-tight uppercase">
              {somethingsOffContent.heading}
            </h3>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-[#DDF0EC]/85 font-normal leading-relaxed">
              <p>
                {somethingsOffContent.paragraph1}
              </p>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#68B8C3] tracking-wide">
                {somethingsOffContent.serifPhrase}
              </p>
              <p className="text-[#FFFDF8]/80 text-base">
                {somethingsOffContent.paragraph2}
              </p>
            </div>

            {/* Interactive State Selector Pills */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATES.map((state, idx) => (
                <button
                  key={state.id}
                  onClick={() => setActiveStateIndex(idx)}
                  className={`px-3 py-2 rounded-lg text-[11px] font-mono uppercase tracking-wider text-center transition-all cursor-pointer border ${
                    activeStateIndex === idx
                      ? "bg-[#68B8C3] text-[#17252A] font-bold border-[#68B8C3] shadow-md"
                      : "bg-[#FFFDF8]/5 text-[#FFFDF8]/70 border-[#FFFDF8]/10 hover:border-[#68B8C3]/50"
                  }`}
                >
                  {state.id}
                </button>
              ))}
            </div>

            {/* Action CTA */}
            <div className="mt-8 sm:mt-10">
              <button
                onClick={() => onOpenBooking(somethingsOffContent.defaultService)}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#C86650] text-[#FFFDF8] hover:bg-[#b55844] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              >
                <span>{somethingsOffContent.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] font-mono text-[#FFFDF8]/40 border-t border-[#FFFDF8]/10 pt-4 z-20">
          <span>{somethingsOffContent.statusBarLabel}</span>
          <span className="hidden sm:inline">{somethingsOffContent.statusBarPrefix} {currentState.title}</span>
        </div>
      </div>
    </div>
  );
}
