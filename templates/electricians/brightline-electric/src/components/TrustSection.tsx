"use client";

import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { trustContent, businessInfo } from "@/data/content";

interface TrustSectionProps {
  onOpenBooking: () => void;
}

export default function TrustSection({ onOpenBooking }: TrustSectionProps) {
  const statements = trustContent.statements;

  return (
    <section className="relative bg-[#F3F0E8] text-[#11110F] py-24 md:py-36 border-t border-[#E5E0D3] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Top Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B] ring-2 ring-[#11110F]/20" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#66665E]">
            {trustContent.eyebrow}
          </span>
        </div>

        {/* Huge Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#11110F] leading-[1.08] mb-4">
          {trustContent.headline}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#55554D] max-w-2xl mb-12 font-normal">
          {trustContent.subtitle}
        </p>

        {/* Huge Phone Number & Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 sm:gap-10 pb-16 mb-16 border-b border-[#DCD6C7]">
          <a
            href={businessInfo.phoneTel}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#11110F] hover:text-[#383830] transition-colors inline-flex items-center gap-3"
          >
            <span>{trustContent.phone}</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="cta-sweep group inline-flex items-center gap-2.5 px-6 py-4 bg-[#11110F] text-[#FFFFFF] text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#2A2A26] self-start"
          >
            <span>{trustContent.ctaText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Three Extremely Simple Statements Appearing One by One */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {statements.map((stmt, idx) => (
            <motion.div
              key={stmt.text}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.18, ease: "easeOut" }}
              className="space-y-2 border-l border-[#D2CCBD] pl-5"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-[#11110F] tracking-tight">
                {stmt.text}
              </h3>
              <p className="text-xs sm:text-sm text-[#66665E] leading-relaxed">
                {stmt.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
