"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  TRANSFORMATIONS_CONTENT,
  TransformationItem,
  transformationsSectionContent,
} from "@/data/content";

function TransformationCard({ item, index }: { item: TransformationItem; index: number }) {
  const [viewState, setViewState] = useState<"after" | "before">("after");

  return (
    <div className="py-16 sm:py-24 border-b border-dust/30 last:border-b-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Caption & Room Narrative */}
        <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-xs text-moss font-medium tracking-widest">
              0{index + 1} / 03
            </span>
            <span className="h-[1px] w-8 bg-dust" />
            <span className="text-xs uppercase tracking-[0.2em] text-moss font-semibold">
              {item.category}
            </span>
          </div>

          <h3 className="font-sans font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight mb-6">
            {item.title}
          </h3>

          {/* Prompt's exact 3-line caption with editorial serif */}
          <div className="space-y-1 my-6 border-l-2 border-terracotta/70 pl-5">
            {item.captionLines.map((line, lIdx) => (
              <p
                key={lIdx}
                className="font-serif italic text-2xl sm:text-3xl text-ink font-normal leading-tight"
              >
                {line}
              </p>
            ))}
          </div>

          <p className="text-sm sm:text-base text-ink/75 leading-relaxed font-normal mb-8 max-w-md">
            {item.subtext}
          </p>

          {/* Clean View Toggle: Before vs Finished */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState("before")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                viewState === "before"
                  ? "bg-ink text-warm-white shadow-xs font-semibold"
                  : "bg-parchment/70 text-ink/70 hover:text-ink hover:bg-parchment"
              }`}
            >
              {transformationsSectionContent.toggleBefore}
            </button>
            <button
              onClick={() => setViewState("after")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                viewState === "after"
                  ? "bg-terracotta text-warm-white shadow-xs font-semibold"
                  : "bg-parchment/70 text-ink/70 hover:text-ink hover:bg-parchment"
              }`}
            >
              {transformationsSectionContent.toggleFinished}
            </button>
          </div>
        </div>

        {/* Visual Transformation Frame: Clean cross-fade display */}
        <div className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
          <div className="relative aspect-[16/11] w-full overflow-hidden bg-parchment shadow-[0_16px_45px_-15px_rgba(35,35,33,0.14)]">
            {viewState === "before" ? (
              <motion.div
                key="before"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={item.beforeImage}
                  alt={item.beforeAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center filter saturate-[0.85] contrast-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-xs text-warm-white text-[10px] uppercase font-mono tracking-[0.2em] px-3 py-1">
                  {transformationsSectionContent.originalSpaceBadge}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="after"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={item.afterImage}
                  alt={item.afterAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center filter saturate-[0.96] contrast-[1.05]"
                />
                <div className="absolute top-4 right-4 bg-terracotta text-warm-white text-[10px] uppercase font-mono tracking-[0.2em] px-3 py-1 shadow">
                  {transformationsSectionContent.finishedBadge}
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Transformations() {
  return (
    <section
      id="transformations"
      className="py-24 sm:py-32 md:py-40 bg-warm-white"
      aria-label="Transformations: Then We Change What Needs Changing"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold mb-4">
            {transformationsSectionContent.sectionTag}
          </div>
          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-ink uppercase max-w-4xl">
            {transformationsSectionContent.headlineLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < transformationsSectionContent.headlineLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="font-serif italic text-xl sm:text-2xl text-ink/80 mt-6 max-w-xl">
            {transformationsSectionContent.subtitle}
          </p>
        </div>

        {/* 3 Transformation Moments */}
        <div className="divide-y divide-dust/40">
          {TRANSFORMATIONS_CONTENT.map((item, index) => (
            <TransformationCard key={item.id} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
