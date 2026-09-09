"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { dripContent } from "@/data/content";

interface TheDripProps {
  onOpenBooking: (service?: string) => void;
}

export default function TheDrip({ onOpenBooking }: TheDripProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Droplet position Y from top (0% to ~85%)
  const dropY = useTransform(scrollYProgress, [0, 0.9], ["4%", "88%"]);
  // Droplet scale and opacity (shrinks and dissolves at bottom impact)
  const dropOpacity = useTransform(scrollYProgress, [0, 0.05, 0.88, 0.94], [0.4, 1, 1, 0]);
  const dropScale = useTransform(scrollYProgress, [0, 0.88, 0.94], [0.9, 1.1, 0.2]);

  // Ripple at bottom impact
  const rippleOpacity = useTransform(scrollYProgress, [0.89, 0.94, 0.99], [0, 1, 0]);
  const rippleScale = useTransform(scrollYProgress, [0.89, 0.99], [0.4, 3.2]);

  // Progressive text reveals
  // 1. ONE DRIP
  const text1Opacity = useTransform(scrollYProgress, [0.18, 0.26, 0.85, 0.98], [0, 1, 1, 0.3]);
  const text1Y = useTransform(scrollYProgress, [0.18, 0.26], [20, 0]);

  // 2. ANNOYING
  const text2Opacity = useTransform(scrollYProgress, [0.38, 0.46, 0.85, 0.98], [0, 1, 1, 0.3]);
  const text2Y = useTransform(scrollYProgress, [0.38, 0.46], [20, 0]);

  // 3. EVERY DAY
  const text3Opacity = useTransform(scrollYProgress, [0.58, 0.66, 0.85, 0.98], [0, 1, 1, 0.3]);
  const text3Y = useTransform(scrollYProgress, [0.58, 0.66], [20, 0]);

  // 4. LET'S FIX IT
  const text4Opacity = useTransform(scrollYProgress, [0.76, 0.84, 1], [0, 1, 1]);
  const text4Y = useTransform(scrollYProgress, [0.76, 0.84], [20, 0]);

  // CTA button reveal
  const ctaOpacity = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.84, 0.92], [0.95, 1]);

  return (
    <div
      id="the-drip"
      ref={containerRef}
      className="relative h-[250vh] bg-[#F3EFE7] selection:bg-[#DDF0EC]"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between py-16 px-4 sm:px-6 overflow-hidden">
        {/* Minimal Kicker at Top */}
        <div className="z-10 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#17252A]/40">
            {dripContent.kicker}
          </span>
        </div>

        {/* Central Vertical Droplet Axis & Ripple */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Faint vertical plumb-line */}
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#17252A]/10 to-transparent" />

          {/* Falling Droplet */}
          <motion.div
            style={{
              top: dropY,
              opacity: dropOpacity,
              scale: dropScale,
            }}
            className="absolute left-1/2 -translate-x-1/2 z-20"
          >
            <svg
              width="28"
              height="38"
              viewBox="0 0 28 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-[0_4px_12px_rgba(104,184,195,0.45)]"
            >
              {/* Teardrop geometry */}
              <path
                d="M 14 0 C 14 0, 0 18, 0 26 C 0 32.6 6.3 38 14 38 C 21.7 38 28 32.6 28 26 C 28 18, 14 0, 14 0 Z"
                fill="#68B8C3"
              />
              {/* Soft interior highlight */}
              <ellipse
                cx="10"
                cy="23"
                rx="4"
                ry="7"
                transform="rotate(-25 10 23)"
                fill="#FFFDF8"
                fillOpacity="0.55"
              />
            </svg>
          </motion.div>

          {/* Impact Ripple Rings at Bottom */}
          <motion.div
            style={{
              opacity: rippleOpacity,
              scale: rippleScale,
            }}
            className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-[#68B8C3] rounded-full pointer-events-none"
          />
          <motion.div
            style={{
              opacity: rippleOpacity,
              scale: rippleScale,
            }}
            className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-36 h-10 border border-[#68B8C3]/50 rounded-full pointer-events-none"
          />
        </div>

        {/* SEQUENTIAL MINIMALIST TYPOGRAPHY */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl px-4 space-y-6 sm:space-y-8">
          {/* 1. ONE DRIP. */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#17252A] uppercase"
          >
            {dripContent.step1}
          </motion.div>

          {/* 2. ANNOYING. */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-wide text-[#17252A]/85 uppercase"
          >
            {dripContent.step2}
          </motion.div>

          {/* 3. EVERY DAY. */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="text-2xl sm:text-4xl lg:text-5xl font-serif italic text-[#68B8C3] tracking-wide"
          >
            {dripContent.step3}
          </motion.div>

          {/* 4. LET'S FIX IT. */}
          <motion.div
            style={{ opacity: text4Opacity, y: text4Y }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17252A] uppercase pt-2"
          >
            {dripContent.step4}
          </motion.div>

          {/* CTA at Bottom of sequence */}
          <motion.div
            style={{ opacity: ctaOpacity, scale: ctaScale }}
            className="pt-6"
          >
            <button
              onClick={() => onOpenBooking(dripContent.defaultService)}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#17252A] text-[#FFFDF8] hover:bg-[#C86650] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
            >
              <span>{dripContent.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#68B8C3] group-hover:text-white" />
            </button>
          </motion.div>
        </div>

        {/* Scroll cue hint */}
        <div className="z-10 pb-4 text-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#17252A]/35">
            {dripContent.scrollHint}
          </span>
        </div>
      </div>
    </div>
  );
}
