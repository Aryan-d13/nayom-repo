"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import { REPAIR_SITUATIONS, RepairSituation, repairContent, businessInfo } from "@/data/content";

interface RepairSectionProps {
  onOpenRepair: (situationTitle?: string) => void;
}

export default function RepairSection({ onOpenRepair }: RepairSectionProps) {
  const [activeSituationId, setActiveSituationId] = useState<string>("wont-open");

  const activeSituation =
    REPAIR_SITUATIONS.find((s) => s.id === activeSituationId) ||
    REPAIR_SITUATIONS[0];

  return (
    <section
      id="repair"
      className="relative w-full bg-[#F5F1E8] text-[#202321] py-24 sm:py-36 border-b border-[#D4D0C7]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Pretitle & Practical Headline */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#A85F45]" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#A85F45] uppercase">
              {repairContent.sectionTag}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#202321] tracking-tight leading-[1.1]">
            {repairContent.titlePart1} <br className="hidden sm:inline" />
            <span className="font-normal text-[#202321]">{repairContent.titlePart2}</span>
          </h2>
        </div>

        {/* Interactive Four Common Situations Grid with Hover/Tap Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Four Common Sentences */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#D4D0C7]">
            {REPAIR_SITUATIONS.map((situation: RepairSituation, index: number) => {
              const isActive = activeSituationId === situation.id;
              return (
                <div
                  key={situation.id}
                  onMouseEnter={() => setActiveSituationId(situation.id)}
                  onClick={() => setActiveSituationId(situation.id)}
                  className={`group py-7 sm:py-9 cursor-pointer transition-all duration-300 flex items-baseline justify-between gap-4 ${
                    isActive ? "opacity-100" : "opacity-55 hover:opacity-90"
                  }`}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-[#A85F45] tracking-widest shrink-0">
                      0{index + 1}
                    </span>
                    <div>
                      <h3
                        className={`font-serif text-2xl sm:text-4xl transition-colors ${
                          isActive
                            ? "text-[#202321] font-normal"
                            : "text-[#202321]/70 group-hover:text-[#202321]"
                        }`}
                      >
                        {situation.title}
                      </h3>
                      {/* Sub-label visible on active */}
                      {isActive && (
                        <p className="font-mono text-[11px] tracking-wider text-[#53645A] mt-1.5 uppercase">
                          {repairContent.pointOfInspectionLabel} {situation.part}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono tracking-widest uppercase transition-opacity ${
                        isActive
                          ? "text-[#A85F45] opacity-100"
                          : "opacity-0 group-hover:opacity-60"
                      }`}
                    >
                      {repairContent.inspectLabel}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isActive
                          ? "translate-x-1 text-[#A85F45]"
                          : "text-[#202321]/30 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Close-up Photography Reveal */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-square bg-[#202321] overflow-hidden shadow-lg border border-[#D4D0C7]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSituation.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeSituation.image}
                    alt={`Close-up photograph of ${activeSituation.part}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/85 via-transparent to-black/20" />

                  {/* Restrained Hardware Label Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 text-[#F5F1E8]">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111311]/80 backdrop-blur-sm text-[10px] font-mono tracking-widest uppercase text-[#D4D0C7] mb-1.5">
                      <Wrench className="w-3 h-3 text-[#A85F45]" />
                      {repairContent.componentLabel} {activeSituation.part}
                    </div>
                    <p className="text-xs text-[#D4D0C7]/90 leading-relaxed font-sans max-w-xs">
                      {activeSituation.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-[10px] font-mono text-[#202321]/50 tracking-wider mt-3 text-right">
              {repairContent.instructions}
            </p>
          </div>
        </div>

        {/* Bottom Callout & Action (No technical lecturing) */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-[#D4D0C7] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-[#202321] font-light italic">
              {repairContent.calloutTitle}
            </p>
            <p className="text-xs text-[#202321]/60 font-mono mt-1 tracking-wider">
              {repairContent.calloutSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenRepair(activeSituation.title)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#A85F45] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45]/90 transition-all shadow-sm"
            >
              {repairContent.bookCta}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`tel:${businessInfo.phoneTel}`}
              className="hidden sm:inline-flex text-xs font-mono text-[#202321]/75 hover:text-[#202321] tracking-wider underline py-2"
            >
              {repairContent.callPrompt} {businessInfo.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
