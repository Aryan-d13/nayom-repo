"use client";

import React from "react";
import { motion } from "motion/react";
import { CONVERSATION_STEPS, dialogueProcessContent } from "@/data/content";

export function DialogueProcess() {
  return (
    <section
      id="about"
      className="relative bg-[#15212A] text-[#F4F0E7] py-24 sm:py-32 md:py-40 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-3 font-medium">
            {dialogueProcessContent.sectionNumber}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#F4F0E7]">
            {dialogueProcessContent.heading}
          </h2>
          <p className="mt-2 text-sm text-[#F4F0E7]/60 font-mono">
            {dialogueProcessContent.subtitle}
          </p>
        </div>

        {/* The Typographic Dialogue Sequence */}
        <div className="space-y-6 sm:space-y-8 max-w-3xl">
          {CONVERSATION_STEPS.map((step, idx) => {
            const isYou = step.speaker === "YOU";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isYou ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-2 border-b border-[#F4F0E7]/10 ${
                  isYou ? "text-[#F4F0E7]/80" : "text-[#F4F0E7]"
                }`}
              >
                {/* Speaker Label */}
                <span
                  className={`text-xs font-mono tracking-widest uppercase flex-shrink-0 w-16 ${
                    isYou ? "text-[#397A91]" : "text-[#D8E9EA]"
                  }`}
                >
                  {step.speaker}:
                </span>

                {/* Spoken sentence in large, refined type */}
                <p
                  className={`text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-snug ${
                    isYou ? "font-normal" : "font-serif italic text-white"
                  }`}
                >
                  {step.text}
                </p>
              </motion.div>
            );
          })}

          {/* "THAT'S IT." Moment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-8 sm:pt-12"
          >
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tighter text-[#397A91]">
              {dialogueProcessContent.closingTitle}
            </h3>

            {/* Closing trust statement */}
            <p className="mt-4 text-base sm:text-xl text-[#F4F0E7]/80 font-normal max-w-xl leading-relaxed">
              {dialogueProcessContent.closingDescription}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
