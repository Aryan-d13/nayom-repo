"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { consultationContent } from "@/data/content";

export default function ConsultationSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-44 bg-porcelain-light border-t border-stone/30 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Candid Conversation Photograph (No equipment, just dialogue) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden bg-stone/20">
              <Image
                src={consultationContent.image}
                alt={consultationContent.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center filter contrast-[1.02] brightness-[0.98]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-[10px] font-mono tracking-widest text-white/90 uppercase">
                {consultationContent.caption}
              </div>
            </div>
          </div>

          {/* Right: The Dialogue & Questions */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-4">
              {consultationContent.eyebrow}
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-ink tracking-tight uppercase mb-10 sm:mb-14"
            >
              {consultationContent.headline}
            </motion.h2>

            {/* Questions revealed one at a time with pencil underline */}
            <div className="space-y-8 sm:space-y-10 mb-12">
              {consultationContent.questions.map((q, idx) => {
                const parts = q.text.split(q.highlight);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 * idx,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                    className="relative text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif font-light text-ink leading-snug"
                  >
                    <span className="text-xs font-mono text-stone align-top mr-3">
                      0{idx + 1}
                    </span>
                    {parts[0]}
                    <span className="relative inline-block text-ink font-normal">
                      {q.highlight}
                      {/* Animated Pencil Underline */}
                      <motion.svg
                        initial={{ pathLength: 0, opacity: 0.2 }}
                        whileInView={{ pathLength: 1, opacity: 0.75 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.15 + 0.1 * idx,
                          duration: 0.7,
                          ease: "easeInOut",
                        }}
                        className="absolute -bottom-1 left-0 w-full h-2 pointer-events-none overflow-visible"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                      >
                        <motion.path
                          d="M0,5 Q30,7 60,4 T100,5"
                          fill="none"
                          stroke="#1C1C1A"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    </span>
                    {parts[1]}
                  </motion.div>
                );
              })}
            </div>

            {/* Simple Closing Line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg text-ink/70 font-light italic font-serif"
            >
              {consultationContent.closing}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
