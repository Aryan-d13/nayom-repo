"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { physicsContent } from "@/data/content";

export function PhysicsMoment() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll transforms: point expands into starfield
  const starfieldScale = useTransform(scrollYProgress, [0.2, 0.7], [0.1, 1]);
  const starfieldOpacity = useTransform(scrollYProgress, [0.15, 0.45, 0.8, 1], [0, 1, 1, 0.2]);
  const centerPointScale = useTransform(scrollYProgress, [0.1, 0.35, 0.6], [0.8, 2.5, 0.3]);
  const centerPointOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7], [1, 0.8, 0.2]);

  // Procedural stars data
  const stars = Array.from({ length: 90 }, (_, i) => {
    const angle = (i / 90) * Math.PI * 2 + (i % 3);
    const distance = 40 + (i * 7) % 360;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: (i % 3) * 0.8 + 0.8,
      opacity: (i % 5) * 0.15 + 0.3,
    };
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[140vh] w-full bg-[#101525] transition-colors duration-1000 flex flex-col justify-center items-center px-6 sm:px-12 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#182038] via-[#101525] to-[#090A0F] pointer-events-none" />

      {/* Central Expanding Starfield Canvas / Elements */}
      <motion.div
        style={{
          scale: starfieldScale,
          opacity: starfieldOpacity,
        }}
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] pointer-events-none"
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E7E6DF]"
            style={{
              left: `calc(50% + ${star.x}px)`,
              top: `calc(50% + ${star.y}px)`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px rgba(231, 230, 223, 0.8)`,
            }}
          />
        ))}
      </motion.div>

      {/* Central Core Light Point */}
      <motion.div
        style={{
          scale: centerPointScale,
          opacity: centerPointOpacity,
        }}
        className="absolute w-3 h-3 rounded-full bg-[#E7E6DF] shadow-[0_0_30px_10px_rgba(128,150,199,0.7)] pointer-events-none"
      />

      {/* Contemplative Typographic Content */}
      <div className="relative z-10 text-center max-w-3xl space-y-8 select-none py-20">
        <div className="font-mono text-xs tracking-[0.3em] text-[#8096C7] uppercase">
          {physicsContent.sectionTag}
        </div>

        <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#E7E6DF] leading-[0.94]">
          {physicsContent.headingLine1} <br />
          {physicsContent.headingLine2}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#8096C7] font-normal"
          data-thought="why?"
        >
          {physicsContent.reaction}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-16 max-w-lg mx-auto border-t border-white/[0.08]"
        >
          <p className="font-serif text-lg sm:text-2xl text-[#E7E6DF]/80 font-light leading-relaxed">
            {physicsContent.conclusionLine1} <br className="hidden sm:inline" />
            {physicsContent.conclusionLine2}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
