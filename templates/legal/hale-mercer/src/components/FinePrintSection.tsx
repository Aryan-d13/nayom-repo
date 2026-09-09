"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FINE_PRINT_ITEMS, finePrintContent } from "@/data/content";

export function FinePrintSection() {
  const [activeItem, setActiveItem] = useState<number>(0);

  return (
    <section className="relative py-24 md:py-36 bg-[#FCFBF7] document-rule-t document-rule-b overflow-hidden">
      {/* Decorative document header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="flex items-center justify-between border-b border-[#171817]/10 pb-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#555650] flex items-center gap-3">
            <span className="text-[#9C3C35] font-semibold">{finePrintContent.sectionNumber}</span>
            <span className="text-[#171817]/25">|</span>
            <span>{finePrintContent.sectionTitle}</span>
          </div>
        </div>

        {/* Large Statement: THE DETAILS ARE RARELY THE SMALL PART. */}
        <div className="mt-12 max-w-5xl">
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#171817] leading-[1.12]">
            {finePrintContent.headingPrefix}{" "}
            <span className="font-serif italic font-normal text-[#9C3C35] underline decoration-[#9C3C35]/30 decoration-wavy">
              {finePrintContent.headingHighlight}
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#555650] font-sans max-w-2xl">
            {finePrintContent.description}
          </p>
        </div>
      </div>

      {/* The Three Highlighted Text Fragments */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="border-t border-[#171817]/10">
          {FINE_PRINT_ITEMS.map((item, index) => {
            const isActive = activeItem === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveItem(index)}
                onClick={() => setActiveItem(index)}
                className={`group py-10 md:py-14 border-b border-[#171817]/10 transition-colors duration-300 cursor-pointer ${
                  isActive ? "bg-[#F1EEE7]/50" : "hover:bg-[#F1EEE7]/25"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline px-4 md:px-6">
                  {/* Clause index */}
                  <div className="md:col-span-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#555650] group-hover:text-[#9C3C35] transition-colors">
                      {item.clauseNo}
                    </span>
                  </div>

                  {/* Highlighted Fragment */}
                  <div className="md:col-span-4 relative">
                    <div className="inline-block relative">
                      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#171817] tracking-tight">
                        {item.phrase}
                      </h3>

                      {/* Moving pen underline indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="fine-print-pen"
                          className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#9C3C35]"
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Short Clear Explanation & Extended Note */}
                  <div className="md:col-span-6 space-y-2">
                    <p className="font-sans text-xl md:text-2xl text-[#171817] font-medium leading-snug">
                      {item.explanation}
                    </p>
                    <p className="font-sans text-sm text-[#555650] leading-relaxed pt-1">
                      {item.extended}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section bottom marginal notation */}
        <div className="mt-8 flex justify-between items-center text-[11px] font-mono text-[#555650] uppercase tracking-wider px-2">
          <span>{finePrintContent.footnoteLeft}</span>
          <span>{finePrintContent.footnoteRight}</span>
        </div>
      </div>
    </section>
  );
}
