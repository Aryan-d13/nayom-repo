"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MATERIALS_CONTENT,
  MaterialItem,
  materialsSectionContent,
} from "@/data/content";

export default function MaterialPalette() {
  const [hoveredId, setHoveredId] = useState<string | null>(MATERIALS_CONTENT[0].id);

  return (
    <section
      id="materials"
      className="py-24 md:py-32 px-6 md:px-12 bg-[#EBE7DF] border-t border-stone/60"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-terracotta" />
            <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
              {materialsSectionContent.sectionNumber}
            </span>
          </div>
          <h2 className="font-sans text-3xl md:text-5xl font-medium tracking-tight text-ink uppercase">
            {materialsSectionContent.heading}
          </h2>
          <p className="mt-3 font-sans text-sm text-ink/70">
            {materialsSectionContent.subheading}
          </p>
        </div>

        {/* Desktop: Horizontal row of oversized swatches with vertical expansion */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-end min-h-[460px] pb-4">
          {MATERIALS_CONTENT.map((mat) => {
            const isHovered = hoveredId === mat.id;

            return (
              <div
                key={mat.id}
                onMouseEnter={() => setHoveredId(mat.id)}
                className="flex flex-col cursor-pointer transition-all duration-300"
              >
                {/* Material Swatch Block */}
                <motion.div
                  animate={{
                    height: isHovered ? 380 : 280,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-[280px] rounded-xs overflow-hidden border border-stone/80 shadow-xs bg-stone/40"
                >
                  <Image
                    src={mat.image}
                    alt={mat.name}
                    fill
                    sizes="(max-width: 1280px) 20vw, 240px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle edge shadow for flat sample desk feel */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                </motion.div>

                {/* Minimal Text Appearing Beside / Below */}
                <div className="mt-4 flex flex-col">
                  <span className="font-sans font-semibold text-xs tracking-[0.2em] text-ink uppercase">
                    {mat.name}
                  </span>
                  <span className="font-serif italic text-sm text-ink/80 mt-1 transition-opacity duration-300">
                    {mat.phrase}
                  </span>
                  <span className="font-mono text-[10px] text-ink/40 mt-1 uppercase tracking-wider">
                    {mat.origin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet: Swipeable & Tappable Swatch Cards */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-6 px-6">
            {MATERIALS_CONTENT.map((mat) => {
              const isSelected = hoveredId === mat.id;

              return (
                <div
                  key={mat.id}
                  onClick={() => setHoveredId(mat.id)}
                  className="shrink-0 w-64 snap-center flex flex-col"
                >
                  <div
                    className={`relative w-full h-72 rounded-xs overflow-hidden border transition-all duration-300 ${
                      isSelected ? "border-terracotta ring-1 ring-terracotta" : "border-stone/80"
                    }`}
                  >
                    <Image
                      src={mat.image}
                      alt={mat.name}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3">
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-ink uppercase">
                      {mat.name}
                    </span>
                    <p className="font-serif italic text-sm text-ink/85 mt-0.5">
                      {mat.phrase}
                    </p>
                    <span className="font-mono text-[10px] text-ink/50 uppercase">
                      {mat.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center font-mono text-[10px] text-ink/50 tracking-wider">
            {materialsSectionContent.mobileHelper}
          </div>
        </div>
      </div>
    </section>
  );
}
