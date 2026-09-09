"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { buildContent, BuildStep } from "@/data/content";

const STEPS: readonly BuildStep[] = buildContent.steps;

export function BuildSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let timeoutId: NodeJS.Timeout;

    const advanceStep = () => {
      setActiveStepIndex((prev) => {
        const nextIndex = (prev + 1) % STEPS.length;
        const currentStep = STEPS[nextIndex];

        if (currentStep.isGlitch) {
          setIsGlitching(true);
          // Pause longer on BREAK IT with glitch
          timeoutId = setTimeout(() => {
            setIsGlitching(false);
            advanceStep();
          }, 1800);
        } else {
          setIsGlitching(false);
          timeoutId = setTimeout(advanceStep, currentStep.isArrow ? 400 : 900);
        }

        return nextIndex;
      });
    };

    timeoutId = setTimeout(advanceStep, 900);
    return () => clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  return (
    <section className="relative w-full bg-[#090A0F] py-32 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04] overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#101525] rounded-full blur-3xl pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Section Label */}
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase">
          {buildContent.sectionTag}
        </div>

        {/* Big Headline */}
        <div className="space-y-1">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#E7E6DF] leading-[0.96]">
            {buildContent.headingLine1} <br />
            {buildContent.headingLine2} <br />
            {buildContent.headingLine3} <br />
            <span className="text-[#8096C7]">{buildContent.headingHighlight}</span>
          </h2>
        </div>

        {/* Narrow Horizontal Track Conveyor */}
        <div className="relative py-10 px-4 sm:px-8 rounded-2xl bg-[#101525]/50 border border-white/[0.06] overflow-x-auto no-scrollbar">
          {/* Track Rails */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

          {/* Steps Sequence */}
          <div className="flex items-center justify-between min-w-[760px] md:min-w-full space-x-2 select-none">
            {STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const isBreakIt = step.id === "break-it";

              return (
                <div key={step.id} className="flex items-center justify-center">
                  {step.isArrow ? (
                    <span
                      className={`font-mono text-base sm:text-lg transition-colors duration-200 px-2 ${
                        isActive ? "text-[#8096C7]" : "text-[#878993]/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  ) : (
                    <div
                      className={`relative px-3 sm:px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
                        isActive
                          ? isBreakIt && isGlitching
                            ? "glitch-effect bg-[#6B638F]/30 text-[#E7E6DF] border border-[#8096C7] shadow-[0_0_15px_rgba(128,150,199,0.3)]"
                            : "bg-[#8096C7] text-[#090A0F] shadow-[0_0_15px_rgba(128,150,199,0.4)] scale-105"
                          : "text-[#878993] hover:text-[#E7E6DF]"
                      }`}
                      data-thought={isBreakIt ? "why it works" : undefined}
                    >
                      {step.label}
                      {isActive && !isBreakIt && (
                        <motion.span
                          layoutId="activeIndicator"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8096C7]"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Supporting Quote */}
        <div className="pt-2 max-w-2xl">
          <p className="font-serif italic text-2xl sm:text-3xl text-[#E7E6DF]/90 font-light leading-relaxed">
            &ldquo;{buildContent.quote}&rdquo;
          </p>
          <div className="mt-4 font-mono text-xs text-[#878993] tracking-wide">
            {buildContent.footer}
          </div>
        </div>
      </div>
    </section>
  );
}
