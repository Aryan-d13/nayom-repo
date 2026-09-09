"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PEOPLE_CONTENT } from "@/data/content";
import { ArrowRight } from "lucide-react";

interface ThePeopleProps {
  onOpenProjectModal: () => void;
}

export default function ThePeople({ onOpenProjectModal }: ThePeopleProps) {
  return (
    <section
      id="people"
      className="py-24 sm:py-32 md:py-40 bg-warm-white border-t border-dust/30"
      aria-label="The People: Maya Ellis and the Fieldhouse Team"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Photograph: Team naturally working inside a renovation (mostly still) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/4.5] sm:aspect-[4/3.8] md:aspect-[4/4.5] w-full overflow-hidden bg-parchment shadow-[0_18px_45px_-18px_rgba(35,35,33,0.16)]">
              <Image
                src={PEOPLE_CONTENT.image}
                alt={PEOPLE_CONTENT.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter saturate-[0.88] contrast-[1.02]"
              />

              {/* Natural light atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />

              {/* Caption tag */}
              <div className="absolute bottom-6 left-6 right-6 flex items-baseline justify-between text-warm-white pointer-events-none">
                <div>
                  <span className="font-sans font-bold text-sm sm:text-base tracking-wider block">
                    {PEOPLE_CONTENT.person}
                  </span>
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-warm-white/80">
                    {PEOPLE_CONTENT.role}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-warm-white/60">
                  {PEOPLE_CONTENT.locationTag}
                </span>
              </div>
            </div>
          </div>

          {/* Quote & Narrative: Enters from side with pencil underline */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold mb-6">
              {PEOPLE_CONTENT.sectionTag}
            </div>

            {/* Quote with pencil underline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8"
            >
              <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink leading-tight font-normal">
                <span className="whitespace-pre-line">{PEOPLE_CONTENT.quotePart1}</span>
                <br />
                <span className="relative inline-block mt-2 text-ink">
                  {PEOPLE_CONTENT.quoteHighlight}
                  
                  {/* Subtle hand-drawn pencil line drawing underneath */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3 overflow-visible pointer-events-none"
                    viewBox="0 0 320 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M2 7C60 3 180 2 318 8"
                      stroke="#A95D49"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
                    />
                  </svg>
                </span>
              </blockquote>
            </motion.div>

            {/* Short Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base sm:text-lg text-ink/75 leading-relaxed font-normal mb-8 max-w-lg"
            >
              {PEOPLE_CONTENT.body}
            </motion.p>

            {/* Small Link: MEET THE TEAM → */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={onOpenProjectModal}
                className="group inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-terracotta transition-colors py-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-terracotta"
              >
                <span>{PEOPLE_CONTENT.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
