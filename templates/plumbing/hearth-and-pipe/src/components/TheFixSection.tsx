"use client";

import { motion } from "motion/react";
import { theFixContent } from "@/data/content";

interface TheFixSectionProps {
  onOpenBooking: () => void;
}

const STEPS = theFixContent.steps;

export default function TheFixSection({ onOpenBooking }: TheFixSectionProps) {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#242522] text-[#FAFAF7] overflow-hidden relative">
      {/* Subtle background ambient warmth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A86F4F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <div className="inline-flex items-center space-x-3 mb-6">
            <span className="w-6 h-[1px] bg-[#A86F4F]" />
            <span className="text-[11px] tracking-[0.28em] uppercase font-mono text-[#A8C7C8]">
              {theFixContent.label}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl tracking-tight font-normal leading-[1.0] text-[#FAFAF7]">
            {theFixContent.headingPart1} <br />
            <span className="font-serif italic text-[#E9E7E1]">{theFixContent.headingItalic}</span>
          </h2>
        </div>

        {/* Steps Checklist with Downward Copper Line */}
        <div className="relative">
          {/* Subtle Continuous Downward Copper Line centered at exactly 16px (left-4) */}
          <div className="absolute left-4 top-2.5 bottom-6 w-[1px] -translate-x-1/2 bg-[#A86F4F]/30 pointer-events-none">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#A86F4F]"
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-14 md:space-y-18">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                className="flex items-start group"
              >
                {/* Node indicator: centered in w-8 column (center at 16px) */}
                <div className="w-8 shrink-0 flex items-center justify-center pt-[2px]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#242522] border-2 border-[#A86F4F] group-hover:bg-[#A86F4F] transition-colors relative z-10" />
                </div>

                {/* Content */}
                <div className="pl-4 sm:pl-6 md:pl-8 max-w-2xl">
                  <span className="text-[11px] font-mono tracking-[0.24em] text-[#A8C7C8] uppercase block mb-2">
                    STEP {step.num}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium text-[#FAFAF7] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#E9E7E1]/70 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reassuring Ending & CTA */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-[#FAFAF7]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl md:text-3xl tracking-tight font-normal text-[#FAFAF7]">
              {theFixContent.endingPart1}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl tracking-tight font-serif italic text-[#A86F4F]">
              {theFixContent.endingItalic}
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-3 text-[12px] tracking-[0.24em] uppercase font-semibold text-[#242522] bg-[#FAFAF7] hover:bg-[#A8C7C8] px-8 py-4 transition-all duration-300 active:scale-[0.98]"
          >
            <span>{theFixContent.cta}</span>
            <span className="text-[#A86F4F] font-mono">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
