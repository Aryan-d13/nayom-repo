"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { FIRM_INFO, finalCtaContent } from "@/data/content";
import { RedStrikeThrough, RedUnderline, RedCheckmark } from "./ui/RedAnnotation";

interface FinalCtaSectionProps {
  onOpenContact: () => void;
}

export function FinalCtaSection({ onOpenContact }: FinalCtaSectionProps) {
  return (
    <section className="relative py-28 md:py-44 paper-texture document-rule-t overflow-hidden">
      {/* Background document layout marks */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section mark */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555650] border-b border-[#171817]/15 pb-1">
              {finalCtaContent.sectionMark}
            </span>
          </div>

          {/* Enormous Serif Typography */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#171817] tracking-tight leading-[1.05] mb-6">
            {finalCtaContent.headline}
          </h2>

          {/* Underlined supporting phrase */}
          <div className="relative inline-block mb-10">
            <p className="font-serif italic text-2xl sm:text-3xl text-[#171817]/90 font-normal">
              {finalCtaContent.subheadline}
            </p>
            <RedUnderline delay={0.4} />
          </div>

          {/* Proofing Annotation Marks: Line crossed out & Start Here checkmark */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-12 font-mono text-xs text-[#555650]">
            {/* Crossed out hesitation */}
            <div className="relative px-3 py-1">
              <span className="text-[#555650]/60 line-through decoration-[#9C3C35] decoration-2">
                {finalCtaContent.crossedOutHesitation}
              </span>
              <RedStrikeThrough delay={0.5} />
            </div>

            <span className="text-[#171817]/20">•</span>

            {/* Checkmark beside START HERE */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FCFBF7] border border-[#171817]/15 shadow-xs">
              <RedCheckmark delay={0.7} />
              <span className="font-bold text-[#171817] tracking-wider uppercase">
                {finalCtaContent.startHereLabel}
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex justify-center mb-14">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-3 px-9 py-4 bg-[#171817] text-[#FCFBF7] hover:bg-[#9C3C35] transition-all duration-300 font-mono text-xs md:text-sm uppercase tracking-widest font-semibold group shadow-md"
            >
              <span>{FIRM_INFO.primaryCta}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
          </div>

          {/* Coordinates: Phone & Address */}
          <div className="pt-10 border-t border-[#171817]/10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto font-mono text-xs text-[#555650]">
            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              <Phone className="w-4 h-4 text-[#9C3C35]" />
              <a
                href={`tel:${FIRM_INFO.phone.replace(/[^0-9]/g, "")}`}
                className="hover:text-[#171817] transition-colors"
              >
                {FIRM_INFO.phone}
              </a>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#9C3C35]" />
              <span>{FIRM_INFO.address}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
