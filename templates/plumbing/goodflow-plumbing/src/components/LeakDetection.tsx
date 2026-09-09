"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { leakDetectionContent } from "@/data/content";

interface LeakDetectionProps {
  onOpenBooking: (service?: string) => void;
}

export function LeakDetection({ onOpenBooking }: LeakDetectionProps) {
  const [stage, setStage] = useState<number>(0);

  return (
    <section
      id="leak-detection"
      className="relative bg-[#F4F0E7] text-[#15212A] py-20 sm:py-28 md:py-36 overflow-hidden border-t border-[#15212A]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Oversized Statement */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-4 font-medium">
              {leakDetectionContent.sectionNumber}
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#15212A] leading-[1.05] mb-6">
              {leakDetectionContent.headingPrefix}{" "}
              <span className="font-serif italic text-[#397A91] block sm:inline">
                {leakDetectionContent.headingHighlight}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#15212A]/80 font-normal leading-relaxed max-w-lg mb-8">
              {leakDetectionContent.description}
            </p>

            <div>
              <button
                type="button"
                onClick={() => onOpenBooking(leakDetectionContent.buttonLabel)}
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-medium tracking-wide uppercase text-[#15212A] hover:text-[#397A91] transition-colors cursor-pointer"
              >
                <span className="editorial-link font-semibold">{leakDetectionContent.buttonLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#397A91] transition-transform duration-200 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Large Photograph of a Quiet Interior with Traveling Tracer Circle */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-none overflow-hidden border border-[#15212A]/15 bg-[#E8DFD0] shadow-xl">
              <Image
                src={leakDetectionContent.image.src}
                alt={leakDetectionContent.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />

              {/* Editorial Frame Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#15212A]/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
