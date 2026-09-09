"use client";

import React from "react";
import { futureContent } from "@/data/content";

export function FutureSection() {
  const {
    sectionTag,
    headingLine1,
    headingLine2,
    headingLine3,
    headingLine4,
    statementLine1,
    statementLine2,
    statementLine3,
    cta,
    footer,
  } = futureContent;

  return (
    <section className="relative w-full bg-[#F2EEE4] text-[#090A0F] py-36 sm:py-48 px-6 sm:px-12 lg:px-20 transition-colors duration-700 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Label in stark contrast */}
        <div className="font-mono text-xs tracking-[0.25em] text-[#090A0F]/60 uppercase">
          {sectionTag}
        </div>

        {/* Huge Text */}
        <div className="space-y-1">
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[-0.03em] text-[#090A0F] leading-[0.92]">
            {headingLine1} <br />
            {headingLine2} <br />
            {headingLine3} <br />
            {headingLine4}
          </h2>
        </div>

        {/* Ambiguous Statement */}
        <div className="pt-6 max-w-2xl">
          <p className="font-serif italic text-2xl sm:text-4xl text-[#090A0F]/90 leading-snug">
            {statementLine1} <br className="hidden sm:inline" />
            {statementLine2} <br className="hidden sm:inline" />
            {statementLine3}
          </p>
        </div>

        {/* Transition Link into Contact */}
        <div className="pt-16 border-t border-[#090A0F]/15 flex justify-between items-center">
          <a
            href="#contact"
            className="group inline-flex items-center space-x-4 font-mono text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-[#090A0F] hover:text-[#2563EB] transition-colors"
            data-thought="say hello"
          >
            <span>{cta}</span>
          </a>

          <span className="font-mono text-xs text-[#090A0F]/50">
            {footer}
          </span>
        </div>
      </div>
    </section>
  );
}
