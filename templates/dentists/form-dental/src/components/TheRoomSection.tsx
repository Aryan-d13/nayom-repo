"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { theRoomContent } from "@/data/content";

export default function TheRoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Gentle upward scroll movement for the interior photograph
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const phraseOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative bg-white py-32 sm:py-44 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Central Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <p className="text-[11px] uppercase tracking-ultra font-medium text-ink/50 mb-3">
            {theRoomContent.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-ink tracking-tight leading-tight">
            <span>{theRoomContent.headingPrefix}</span>
            <span className="font-serif italic font-normal text-ink">
              {theRoomContent.headingSerif}
            </span>
          </h2>
        </div>

        {/* Interior Photography Canvas with Corner Editorial Labels */}
        <div className="relative max-w-5xl mx-auto">
          {/* Top Left Label: QUIET ROOMS */}
          <motion.div
            style={{ opacity: phraseOpacity }}
            className="absolute -top-7 sm:-top-9 left-2 sm:left-4 z-20"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-ultra font-medium text-ink/70 border-b border-stone/50 pb-1">
              {theRoomContent.cornerPhrases[0].label}
            </span>
          </motion.div>

          {/* Top Right Label: NATURAL LIGHT */}
          <motion.div
            style={{ opacity: phraseOpacity }}
            className="absolute -top-7 sm:-top-9 right-2 sm:right-4 z-20"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-ultra font-medium text-ink/70 border-b border-stone/50 pb-1">
              {theRoomContent.cornerPhrases[1].label}
            </span>
          </motion.div>

          {/* Photograph Frame */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-sm bg-stone/20 shadow-md">
            <motion.div
              style={{ y: imageY, scale: 1.08 }}
              className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
            >
              <Image
                src={theRoomContent.image}
                alt={theRoomContent.imageAlt}
                fill
                sizes="(max-width: 1200px) 100vw, 1100px"
                className="object-cover object-center filter contrast-[1.03] brightness-[0.98]"
              />
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
            </motion.div>
          </div>

          {/* Bottom Right Label: NO RUSH */}
          <motion.div
            style={{ opacity: phraseOpacity }}
            className="absolute -bottom-7 sm:-bottom-9 right-2 sm:right-4 z-20"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-ultra font-medium text-ink/70 border-b border-stone/50 pb-1">
              {theRoomContent.cornerPhrases[2].label}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
