"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { heroContent, businessInfo } from "@/data/content";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setAnimationStage(4);
      return;
    }

    // Sequence imitating someone slowly turning up an architectural dimmer
    const timer1 = setTimeout(() => setAnimationStage(1), 300); // narrow light slit opens
    const timer2 = setTimeout(() => setAnimationStage(2), 900); // room light expands & eyebrow
    const timer3 = setTimeout(() => setAnimationStage(3), 1500); // headline reveals L->R
    const timer4 = setTimeout(() => setAnimationStage(4), 2200); // serif & CTA follow, brightness settles

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden bg-[#11110F] select-none">
      {/* Background Image Container with Dimmer Light Expansion */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Deep black backdrop */}
        <div className="absolute inset-0 bg-[#0C0C0A] z-0" />

        {/* Real architectural hero image with expanding light aperture */}
        <motion.div
          initial={{ opacity: 0, clipPath: "polygon(48% 0%, 52% 0%, 52% 100%, 48% 100%)" }}
          animate={
            animationStage >= 2
              ? {
                  opacity: 1,
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  filter: animationStage >= 4 ? "brightness(1.02) contrast(1.03)" : "brightness(0.85)",
                }
              : animationStage === 1
              ? {
                  opacity: 0.7,
                  clipPath: "polygon(35% 0%, 65% 0%, 65% 100%, 35% 100%)",
                  filter: "brightness(0.75)",
                }
              : { opacity: 0, clipPath: "polygon(49% 0%, 51% 0%, 51% 100%, 49% 100%)" }
          }
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <Image
            src={heroContent.image}
            alt={heroContent.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Natural Vignette and Shadow Gradient: Keeps copy legible and focuses light off-center */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/60 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11110F] via-[#11110F]/45 to-transparent w-full md:w-3/4" />
        </motion.div>
      </div>

      {/* Far Right Edge: Tiny Vertical Word "BRIGHTLINE" */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-20 pointer-events-none">
        <span className="w-[1px] h-12 bg-[#33332D]" />
        <span className="[writing-mode:vertical-lr] text-[10px] tracking-[0.35em] text-[#78786E] uppercase font-mono">
          {heroContent.verticalBrand}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B] indicator-pulse" />
      </div>

      {/* Hero Copy Placed Strictly at the Bottom-Left */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 pb-16 pt-36 md:pb-20">
        <div className="max-w-2xl">
          {/* Small Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={animationStage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2.5 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
            <p className="text-[11px] sm:text-xs tracking-[0.2em] font-medium text-[#C9C6BD] uppercase">
              {heroContent.eyebrow}
            </p>
          </motion.div>

          {/* Large Headline revealed with left-to-right clipping mask */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={animationStage >= 3 ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#FFFFFF] leading-[1.08]"
            >
              {heroContent.headline}
            </motion.h1>
          </div>

          {/* Serif Line arriving slightly later */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={animationStage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="mb-6"
          >
            <p className="text-2xl sm:text-3xl text-[#E5E2D9] font-serif italic tracking-wide">
              {heroContent.serifLine}
            </p>
          </motion.div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={animationStage >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="text-sm sm:text-base text-[#C9C6BD] leading-relaxed max-w-lg mb-8 font-normal"
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Group: BOOK A SERVICE → + CALL */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={animationStage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <button
              onClick={onOpenBooking}
              className="cta-sweep group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#FFFFFF] text-[#11110F] text-xs sm:text-[13px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#F3F0E8]"
            >
              <span>{heroContent.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href={businessInfo.phoneTel}
              className="group inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-[13px] font-medium tracking-wide text-[#C9C6BD] hover:text-[#FFFFFF] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#BDF45B]" />
              <span>{heroContent.ctaPhone}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
