"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemperature } from "@/context/TemperatureContext";
import { ArrowRight, ChevronDown } from "lucide-react";

import { diagnosticsContent } from "@/data/content";

const SYMPTOMS = diagnosticsContent.symptoms;

export default function DiagnosticsSection() {
  const { openBooking } = useTemperature();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSymptom = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="diagnostics" className="relative w-full bg-[#FCFCF9] text-ink py-28 sm:py-36 px-6 sm:px-8 lg:px-12 border-b border-sand/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-terracotta block mb-4">
            {diagnosticsContent.overline}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-ink leading-[1.1]">
            {diagnosticsContent.headline}
          </h2>
        </div>

        {/* 4 Ordinary Situations List */}
        <div className="border-t border-ink/15 divide-y divide-ink/15">
          {SYMPTOMS.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="group py-8 sm:py-10 transition-colors duration-300"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSymptom(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSymptom(item.id);
                    }
                  }}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded p-1"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-slate/60 shrink-0">
                      {item.number}
                    </span>
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-sans font-semibold tracking-tight text-ink group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-200">
                      {item.headline}
                    </h3>
                  </div>

                  {/* Hover Annotation */}
                  <div className="flex items-center gap-3 pl-8 md:pl-0 shrink-0">
                    <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      {diagnosticsContent.inspectPrompt}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-terracotta" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Practical Insight Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-2 pl-8 md:pl-12 max-w-3xl">
                        <p className="text-sm sm:text-base text-slate font-light leading-relaxed mb-4">
                          {item.practicalInsight}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70 bg-cream px-2.5 py-1 rounded">
                            {item.frequencyNote}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openBooking(item.headline);
                            }}
                            className="text-xs uppercase tracking-[0.18em] text-terracotta font-semibold hover:underline cursor-pointer"
                          >
                            {diagnosticsContent.scheduleCta}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Anchor */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-ink/15 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-serif italic text-2xl sm:text-3xl text-ink leading-snug">
              {diagnosticsContent.trustQuote}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openBooking(diagnosticsContent.generalBookingIssue)}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-white hover:bg-terracotta transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <span>{diagnosticsContent.bookCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
