"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { treatmentsData, treatmentsContent } from "@/data/content";

interface TreatmentsSectionProps {
  onOpenBooking: () => void;
}

export default function TreatmentsSection({ onOpenBooking }: TreatmentsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="care" className="py-24 sm:py-32 lg:py-40 bg-porcelain relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-6 border-b border-stone/40">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-3">
              {treatmentsContent.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium text-ink tracking-tight uppercase">
              {treatmentsContent.heading}
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm font-light text-ink/60 max-w-xs">
            {treatmentsContent.description}
          </p>
        </div>

        {/* Contact Sheet Studio Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {treatmentsData.map((item, idx) => {
            const isHovered = hoveredId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col justify-between select-none cursor-pointer"
              >
                {/* Contact Sheet Frame Container (No card shadows, authentic darkroom border aesthetic) */}
                <div className="relative bg-porcelain-light p-3 border border-stone/40 transition-colors duration-300 group-hover:border-ink/70">
                  {/* Studio Crop Corner Ticks */}
                  <div className="absolute top-1 left-1 text-[9px] font-mono text-stone pointer-events-none">
                    ┌
                  </div>
                  <div className="absolute top-1 right-1 text-[9px] font-mono text-stone pointer-events-none">
                    ┐
                  </div>
                  <div className="absolute bottom-1 left-1 text-[9px] font-mono text-stone pointer-events-none">
                    └
                  </div>
                  <div className="absolute bottom-1 right-1 text-[9px] font-mono text-stone pointer-events-none">
                    ┘
                  </div>

                  {/* Image Frame with Double-Exposure / Second Crop Slide */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone/20">
                    {/* Primary Image */}
                    <div
                      className={`relative w-full h-full transition-transform duration-700 ease-out ${
                        isHovered ? "scale-[1.03]" : "scale-100"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover object-center filter contrast-[1.02]"
                      />
                    </div>

                    {/* Secondary Contact-Sheet Crop that slides over on hover */}
                    <div
                      className={`absolute inset-0 bg-porcelain-light transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHovered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-full opacity-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={item.secondaryCrop}
                        alt={`${item.title} detail crop`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover object-center filter grayscale contrast-110"
                      />
                      <div className="absolute top-2 right-2 bg-ink/80 text-porcelain text-[9px] font-mono uppercase px-1.5 py-0.5 tracking-wider">
                        {treatmentsContent.proofBadge}
                      </div>
                    </div>
                  </div>

                  {/* Frame ID Strip */}
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono tracking-widest text-ink/40 uppercase">
                    <span>FRAME 0{idx + 1}A</span>
                    <span>{treatmentsContent.isoLabel}</span>
                  </div>
                </div>

                {/* Content Beneath Frame */}
                <div className="pt-5 pb-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-ink uppercase">
                      {item.title}
                    </h3>

                    {/* Tiny Handwritten Annotation that shifts position on hover */}
                    <span
                      className={`font-hand text-lg sm:text-xl text-ink/70 transform transition-transform duration-500 ${
                        isHovered
                          ? "-translate-y-1.5 -translate-x-1 rotate-[-3deg] text-ink font-semibold"
                          : "rotate-[2deg]"
                      }`}
                    >
                      ~ {item.annotation}
                    </span>
                  </div>

                  <p className="text-sm text-ink/70 font-light leading-relaxed mb-4">
                    {item.sentence}
                  </p>

                  <button
                    onClick={onOpenBooking}
                    className="text-[11px] font-mono tracking-widest uppercase text-ink/60 group-hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{treatmentsContent.consultButton}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
