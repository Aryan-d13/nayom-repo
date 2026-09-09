"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { heroContent } from "@/data/content";

interface HeroProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
}

export default function Hero({ onReserveClick, onMenuClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Smooth scroll parallax transforms
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  const octopusY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const sourdoughY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const sourdoughRotate = useTransform(scrollYProgress, [0, 1], [4, 8]);
  const bgStampY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={heroRef}
      className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden border-b border-[#DDD1BB] paper-grain"
    >
      {/* Parallax subtle vintage postal stamp watermark in background */}
      <motion.div
        style={{ y: bgStampY }}
        className="absolute right-6 top-10 pointer-events-none opacity-[0.06] select-none hidden lg:block font-serif text-[180px] leading-none font-bold text-[#20201D]"
      >
        MARA
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Editorial Content (7 cols) with scroll fade/parallax */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start z-10"
        >
          {/* Location & Tag pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF6EE] border border-[#DDD1BB] rounded-full text-xs font-medium tracking-wider text-[#687052] uppercase mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#C75037]" />
            <span>{heroContent.locationBadge}</span>
          </div>

          {/* Hand-set giant headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#20201D] font-bold leading-[0.95] mb-6">
            {heroContent.headingPart1}
            <span className="block italic font-normal text-[#C75037] mt-1">
              {heroContent.headingPart2}
            </span>
          </h1>

          {/* Sensory Narrative description */}
          <p className="text-base sm:text-lg text-[#68655E] max-w-xl font-normal leading-relaxed mb-8">
            {heroContent.description}
          </p>

          {/* Quick Fact highlights strip */}
          <div className="grid grid-cols-3 gap-4 border-y border-dashed border-[#DDD1BB] py-4 my-2 w-full max-w-lg text-left">
            {heroContent.facts.map((fact) => (
              <div key={fact.label}>
                <span className="block text-[10px] uppercase tracking-widest text-[#9B978F]">
                  {fact.label}
                </span>
                <span className="font-serif text-base text-[#20201D] font-semibold">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={onReserveClick}
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#C75037] hover:bg-[#A93E27] text-[#FFFDF8] font-medium text-sm tracking-widest uppercase rounded-xs shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>{heroContent.primaryCta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onMenuClick}
              className="inline-flex items-center gap-2 px-6 py-4 bg-transparent hover:bg-[#FAF6EE] text-[#20201D] border border-[#20201D] font-medium text-sm tracking-widest uppercase rounded-xs transition-all cursor-pointer"
            >
              <span>{heroContent.secondaryCta}</span>
            </button>
          </div>

          {/* Handwritten assurance */}
          <div className="mt-8 flex items-center gap-3">
            <span className="font-hand text-2xl text-[#687052] font-semibold rotate-[-2deg]">
              {heroContent.handwrittenNote}
            </span>
          </div>
        </motion.div>

        {/* Right Asymmetric Overlapping Photo Composition with Multi-Layer Parallax */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-6 lg:py-0">
          {/* Main Dish Photo (Charred Octopus) with Parallax */}
          <motion.div
            style={{ y: octopusY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[280px] sm:w-[340px] md:w-[380px] bg-[#FAF6EE] p-3 pb-6 shadow-xl border border-[#DDD1BB] rotate-[-2.5deg] hover:rotate-0 transition-transform duration-500"
          >
            {/* Masking tape top center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#FAF6EE]/90 border-l border-r border-dashed border-[#DDD1BB] shadow-2xs rotate-[1.5deg] z-20 backdrop-blur-xs" />

            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#E5DBC7]">
              <Image
                src={heroContent.mainDish.image}
                alt={heroContent.mainDish.alt}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#20201D] leading-tight">
                  {heroContent.mainDish.title}
                </h3>
                <p className="text-[11px] text-[#68655E] uppercase tracking-wider">
                  {heroContent.mainDish.subtitle}
                </p>
              </div>
              <span className="font-serif text-lg font-bold text-[#C75037]">
                {heroContent.mainDish.price}
              </span>
            </div>
          </motion.div>

          {/* Overlapping Second Dish Photo (Warm Sourdough) with Opposing Parallax & Slight Rotate */}
          <motion.div
            style={{ y: sourdoughY, rotate: sourdoughRotate }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-8 z-20 w-[200px] sm:w-[240px] bg-[#FAF6EE] p-2.5 pb-5 shadow-2xl border border-[#DDD1BB]"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#E5DBC7]">
              <Image
                src={heroContent.secondDish.image}
                alt={heroContent.secondDish.alt}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            <div className="mt-2 px-1">
              <h4 className="font-serif text-sm font-bold text-[#20201D] leading-tight">
                {heroContent.secondDish.title}
              </h4>
              <p className="text-[10px] text-[#68655E]">
                {heroContent.secondDish.subtitle}
              </p>
            </div>
          </motion.div>

          {/* Handwritten Annotation & Curly Arrow */}
          <motion.div
            style={{ y: octopusY }}
            className="absolute -top-6 right-2 sm:right-6 z-30 flex flex-col items-end pointer-events-none"
          >
            <span className="font-hand text-2xl sm:text-3xl text-[#C75037] font-bold rotate-[6deg] drop-shadow-xs">
              {heroContent.mainDish.tag}
            </span>
            <svg
              className="w-12 h-10 text-[#C75037] -mt-1 mr-4 rotate-12"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M 40 5 Q 35 25 15 28 Q 12 28 8 26 M 8 26 L 15 22 M 8 26 L 14 33" />
            </svg>
          </motion.div>

          {/* Olive Wood Fire badge */}
          <div className="absolute -right-4 bottom-12 z-20 bg-[#687052] text-[#FFFDF8] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md rotate-[-6deg]">
            <Flame className="w-3.5 h-3.5 text-[#E7C85A]" />
            <span>{heroContent.hearthBadge}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
