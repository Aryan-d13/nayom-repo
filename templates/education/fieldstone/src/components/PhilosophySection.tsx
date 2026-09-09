"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { philosophyContent, PHILOSOPHY_PILLARS } from "@/data/content";

export default function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 bg-[#20231F] text-[#FFFDF8] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#E5B84C] block font-mono">
            {philosophyContent.eyebrow}
          </span>
        </motion.div>

        {/* Emotional Editorial Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Candid Photograph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF8]/15 -rotate-1">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Older student walking thoughtfully through campus hallway"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20231F]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-handwritten text-xl text-[#E5B84C]">
                  {philosophyContent.photoCaption}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Headline & Serif Statement */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[0.95] text-[#FFFDF8]"
            >
              {philosophyContent.headingMain} <br />
              <span className="text-[#E5B84C]">{philosophyContent.headingHighlight}</span> {philosophyContent.headingEnd}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-serif-title text-2xl sm:text-4xl lg:text-5xl italic text-[#4E7FA3] mt-8 leading-snug"
            >
              {philosophyContent.serifQuote}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-[#FFFDF8]/75 mt-8 leading-relaxed max-w-xl"
            >
              {philosophyContent.bodyCopy}
            </motion.p>
          </div>
        </div>

        {/* Three Typographic Statements — Letting Typography Breathe, NOT value cards */}
        <div className="mt-28 sm:mt-36 pt-16 border-t border-[#FFFDF8]/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {PHILOSOPHY_PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 * idx }}
                className="flex flex-col"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-[#E5B84C] font-semibold mb-4">
                  0{idx + 1}
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FFFDF8] leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-base text-[#FFFDF8]/70 mt-4 leading-relaxed font-sans">
                  {pillar.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
