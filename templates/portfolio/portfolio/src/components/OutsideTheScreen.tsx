"use client";

import React from "react";
import Image from "next/image";
import { outsideScreenContent } from "@/data/content";

export function OutsideTheScreen() {
  const { image, sectionTag, line1, line2, line3, line4, line5, line6, footerLeft, footerRight } =
    outsideScreenContent;

  return (
    <section className="relative w-full min-h-[90vh] bg-[#090A0F] py-28 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04] overflow-hidden flex items-center">
      {/* Background Sensory Visual with moody vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover opacity-35 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/70 to-[#090A0F]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-[#090A0F]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase mb-8">
          {sectionTag}
        </div>

        {/* Large Typographic Stanza */}
        <div className="space-y-2 select-none">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#E7E6DF] leading-[1.02]">
            {line1} <br />
            <span className="text-[#8096C7]">{line2}</span> <br />
            <span className="text-[#E7E6DF]">{line3}</span> <br />
            <span className="text-[#6B638F]">{line4}</span> <br />
            {line5} <br />
            <span className="font-serif italic font-normal text-[#F2EEE4]">
              {line6}
            </span>
          </h2>
        </div>

        {/* Subtle Footnote */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-[#878993]">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    </section>
  );
}
