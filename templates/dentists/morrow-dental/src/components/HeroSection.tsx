"use client";

import React from "react";
import Image from "next/image";
import { heroContent } from "@/data/content";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const finalWordDelay = 0.2 + (heroContent.headlineWords.length - 1) * 0.1;

  return (
    <section className="relative pt-6 pb-20 md:pt-12 md:pb-28 lg:pt-16 lg:pb-36 overflow-hidden bg-porcelain">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Typography & Editorial Narrative */}
          <div className="lg:col-span-6 z-10 pr-0 lg:pr-6">
            {/* Small Label */}
            <div
              className="animate-fade flex items-center gap-3 mb-6 sm:mb-8"
              style={{ animationDelay: "0.08s" }}
            >
              <span className="text-[11px] font-mono tracking-widest text-ink/60 uppercase">
                {heroContent.locationLabel}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone" />
              <span className="text-[11px] font-mono tracking-widest text-ink/60 uppercase">
                {heroContent.clinicLabel}
              </span>
            </div>

            {/* Main Headline (Reveals Word-by-Word with Darkroom Blur-to-Sharp Exposure) */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-medium tracking-tight text-ink leading-[1.05] mb-4">
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {heroContent.headlineWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="inline-block"
                    style={{
                      animation: "darkroomWord 0.65s cubic-bezier(0.16, 1, 0.3, 1) both",
                      animationDelay: `${0.2 + index * 0.1}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            {/* Small Serif Line (Appears ONLY after final headline word) */}
            <p
              className="animate-fade-up font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink/80 font-normal mb-8 tracking-normal"
              style={{ animationDelay: `${finalWordDelay + 0.25}s` }}
            >
              {heroContent.serifLine}
            </p>

            {/* Supporting Copy */}
            <p
              className="animate-fade-up text-base sm:text-lg text-ink/70 max-w-md font-light leading-relaxed mb-10"
              style={{ animationDelay: `${finalWordDelay + 0.45}s` }}
            >
              {heroContent.copy}
            </p>

            {/* CTAs (Come Last) */}
            <div
              className="animate-fade-up flex flex-wrap items-center gap-6 sm:gap-8"
              style={{ animationDelay: `${finalWordDelay + 0.65}s` }}
            >
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 bg-ink text-porcelain text-xs font-medium uppercase tracking-widest hover:bg-ink-light transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                {heroContent.primaryCta}
              </button>
              <a
                href="#team"
                className="text-xs uppercase tracking-widest text-ink hover:text-ink/60 transition-colors py-2 border-b border-stone/50 hover:border-ink font-medium"
              >
                {heroContent.secondaryCta}
              </a>
            </div>
          </div>

          {/* Right: The Portrait with Center-Outward Shutter Opening */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* The portrait container extending slightly beyond visible composition */}
            <div className="relative w-full lg:-mr-8 xl:-mr-16">
              {/* Darkroom Developing Shutter Container */}
              <div className="animate-shutter relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden bg-stone/20">
                <Image
                  src={heroContent.image}
                  alt={heroContent.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 650px"
                  className="object-cover object-center filter contrast-[1.03] brightness-[0.98]"
                />
                {/* Subtle soft darkroom warm tone wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none mix-blend-multiply" />
              </div>

              {/* Tiny Caption Beneath */}
              <div
                className="animate-fade mt-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-ink/50 uppercase"
                style={{ animationDelay: "1.3s" }}
              >
                <span>{heroContent.caption}</span>
                <span>35MM · NATURAL LIGHT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
