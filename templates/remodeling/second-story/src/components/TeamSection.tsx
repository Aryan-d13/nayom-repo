"use client";

import React from "react";
import Image from "next/image";
import { TEAM_CONTENT } from "@/data/content";

export default function TeamSection() {
  return (
    <section
      id="about"
      className="py-24 md:py-36 px-6 md:px-12 bg-white border-t border-stone/50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photograph: Candid on-site portrait in renovation environment */}
          <div className="md:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-xs overflow-hidden border border-stone/80 shadow-xs bg-stone/20">
              <Image
                src={TEAM_CONTENT.image}
                alt={TEAM_CONTENT.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between text-xs font-mono text-ink/50">
              <span>{TEAM_CONTENT.fieldNotesLeft}</span>
              <span>{TEAM_CONTENT.fieldNotesRight}</span>
            </div>
          </div>

          {/* Editorial Text Block */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-terracotta" />
              <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
                {TEAM_CONTENT.sectionNumber}
              </span>
            </div>

            {/* Main Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-ink leading-snug">
              {TEAM_CONTENT.quote}
            </blockquote>

            {/* Grounded Human Copy */}
            <p className="font-sans text-base sm:text-lg text-ink/80 leading-relaxed max-w-xl">
              {TEAM_CONTENT.supportingText}
            </p>

            {/* Name & Role without fake corporate claims */}
            <div className="pt-4 border-t border-stone/40 flex flex-col">
              <span className="font-sans font-medium text-base text-ink tracking-tight">
                {TEAM_CONTENT.name}
              </span>
              <span className="font-mono text-xs text-ink/60 tracking-wider mt-0.5">
                {TEAM_CONTENT.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
