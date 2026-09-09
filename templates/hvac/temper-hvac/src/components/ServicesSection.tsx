"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTemperature } from "@/context/TemperatureContext";
import { ArrowRight } from "lucide-react";

import { servicesContent } from "@/data/content";

const CHAPTERS = servicesContent.chapters;

export default function ServicesSection() {
  const { openBooking } = useTemperature();
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <section id="services" className="relative w-full">
      {/* Chapter Indicator Bar */}
      <div className="sticky top-20 z-20 bg-cream/90 backdrop-blur-md border-b border-sand/40 px-6 sm:px-8 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate">
            {servicesContent.overline}
          </span>
          <div className="flex items-center gap-6 sm:gap-10">
            {CHAPTERS.map((ch, idx) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                onClick={() => setActiveChapter(idx)}
                className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors cursor-pointer ${
                  activeChapter === idx
                    ? "text-terracotta font-semibold"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {ch.word}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Chapters (Not cards: full environmental sections) */}
      <div className="divide-y divide-slate/15">
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.id}
            id={chapter.id}
            className={`relative min-h-[95vh] lg:min-h-screen w-full flex items-center ${chapter.bgClass} transition-colors duration-700 py-24 px-6 sm:px-8 lg:px-12 overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Narrative Column */}
              <div className="lg:col-span-6 space-y-8 z-10">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.3em] font-mono text-slate/70">
                    {chapter.subhead}
                  </span>
                  {/* Giant Environmental Word */}
                  <h3 className="text-6xl sm:text-8xl lg:text-9xl font-sans font-black tracking-tight leading-none text-ink">
                    {chapter.word}
                  </h3>
                </div>

                {/* Short Honest Tagline */}
                <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-ink/90 font-light leading-snug">
                  {chapter.tagline}
                </p>

                {/* Practical Description */}
                <p className="text-sm sm:text-base text-slate font-light leading-relaxed max-w-xl">
                  {chapter.description}
                </p>

                {/* Practical Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {chapter.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink/80 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Small CTA */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => openBooking(`Service Inquiry: ${chapter.word} - ${chapter.subhead}`)}
                    className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-ink text-white hover:bg-terracotta transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>{chapter.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Architectural Environmental Image Column */}
              <div className="lg:col-span-6 relative z-10">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/40">
                  <Image
                    src={chapter.image}
                    alt={`${chapter.word} environment in Phoenix residence`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
