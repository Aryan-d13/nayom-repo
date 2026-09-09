"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { teamContent } from "@/data/content";

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative bg-bone py-32 sm:py-44 overflow-hidden border-t border-stone/20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left / Top on mobile: Single Large Portrait entering from bottom */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ y: 70, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none rounded-sm overflow-hidden bg-stone/20 shadow-md"
            >
              <Image
                src={teamContent.portrait}
                alt={teamContent.portraitAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 450px"
                className="object-cover object-top filter grayscale-[20%] contrast-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white text-xs tracking-widest uppercase">
                <span className="font-light">{teamContent.dentist}</span>
              </div>
            </motion.div>
          </div>

          {/* Right / Bottom on mobile: Masked Quote + Paragraph + Discipline */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            {/* Section Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="text-[11px] uppercase tracking-ultra font-medium text-ink/50">
                {teamContent.eyebrow}
              </span>
            </motion.div>

            {/* Masked Quote */}
            <div className="overflow-hidden pb-3 mb-8">
              <motion.blockquote
                initial={{ y: "100%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="text-2xl sm:text-4xl xl:text-5xl font-light text-ink tracking-tight leading-snug sm:leading-tight"
              >
                {teamContent.quote}
              </motion.blockquote>
            </div>

            {/* Paragraph: appears after quote */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mb-8 font-normal"
            >
              {teamContent.paragraph}
            </motion.p>

            {/* Dentist Name & Role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-6 border-t border-stone/30 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            >
              <h3 className="text-sm font-medium uppercase tracking-widest text-ink">
                {teamContent.dentist}
              </h3>
              <span className="text-xs uppercase tracking-widest text-ink/60">
                {teamContent.role}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
