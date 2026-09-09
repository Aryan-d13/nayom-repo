"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { businessInfo, finalCtaContent } from "@/data/content";

interface FinalCtaProps {
  onOpenBooking: () => void;
}

export default function FinalCta({ onOpenBooking }: FinalCtaProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isStill, setIsStill] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Track when user reaches near bottom to freeze into complete stillness
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.88) {
        setIsStill(true);
      } else {
        setIsStill(false);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Transform for the path drawing length
  const pathLength = useTransform(scrollYProgress, [0.1, 0.95], [0.3, 1]);

  // Path data for the returning water line that curves behind the text
  // and finishes by curving directly into an arrow pointing toward the CTA button
  // ViewBox: 0 0 1000 800
  const finalPath = "M 500 0 C 450 140, 320 220, 280 340 C 240 460, 380 540, 430 620 C 460 670, 480 690, 520 690";

  return (
    <section
      id="final-cta"
      ref={containerRef}
      className="relative min-h-screen py-28 sm:py-36 bg-[#17252A] text-[#FFFDF8] architectural-grid-dark flex items-center justify-center overflow-hidden selection:bg-[#68B8C3] selection:text-[#17252A]"
    >
      {/* RETURNING WATER PATH SVG (Travels behind text, becomes arrow pointing at CTA, stops still) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle water glow trail */}
          <motion.path
            d={finalPath}
            stroke="#68B8C3"
            strokeWidth="12"
            strokeLinecap="round"
            strokeOpacity="0.2"
            style={{ pathLength }}
          />

          {/* Core returning water line */}
          <motion.path
            d={finalPath}
            stroke="#68B8C3"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ pathLength }}
          />

          {/* Terminal Arrow Head pointing toward the CTA (x=520, y=690) */}
          <g
            className={`transition-opacity duration-500 ${
              isStill ? "opacity-100" : "opacity-40"
            }`}
          >
            {/* Arrowhead polygon pointing right/east */}
            <polygon
              points="520,682 536,690 520,698"
              fill="#68B8C3"
            />
          </g>
        </svg>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Austin Location Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#68B8C3]" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#DDF0EC]/70">
            {finalCtaContent.tag}
          </span>
        </motion.div>

        {/* Large Heading: KEEP THINGS MOVING. */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFDF8] uppercase leading-[1.05]"
        >
          {finalCtaContent.heading}
        </motion.h2>

        {/* Serif Phrase: We'll handle the plumbing. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4"
        >
          <p className="font-serif italic text-2xl sm:text-4xl text-[#68B8C3] tracking-wide">
            {finalCtaContent.serifPhrase}
          </p>
        </motion.div>

        {/* Supporting Note */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-6 max-w-lg text-sm sm:text-base text-[#DDF0EC]/80 font-normal leading-relaxed"
        >
          {finalCtaContent.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#C86650] hover:bg-[#b55844] text-[#FFFDF8] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
          >
            <span>{finalCtaContent.primaryCta}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Phone Call */}
          <a
            href={`tel:${finalCtaContent.phoneTel}`}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#FFFDF8]/25 hover:border-[#68B8C3] bg-[#FFFDF8]/5 hover:bg-[#FFFDF8]/10 text-[#FFFDF8] text-xs sm:text-sm font-medium tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
          >
            <Phone className="w-4 h-4 text-[#68B8C3]" />
            <span>{finalCtaContent.phoneCall}</span>
          </a>
        </motion.div>

        {/* System Stillness indicator */}
        <div className="mt-12 text-[11px] font-mono text-[#DDF0EC]/40 tracking-wider">
          {isStill ? finalCtaContent.statusStill : finalCtaContent.statusActive}
        </div>
      </div>
    </section>
  );
}
