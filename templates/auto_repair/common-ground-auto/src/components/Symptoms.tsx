"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { symptomsContent } from "@/data/content";

export default function Symptoms() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section
      id="diagnostics"
      className="relative bg-paper text-asphalt py-24 sm:py-32 border-b border-black/10 paper-texture select-none"
      aria-labelledby="symptoms-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-asphalt/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-asphalt/60 mb-2">
              <span className="w-2 h-2 bg-signal-red" />
              <span>{symptomsContent.step}</span>
            </div>
            <h2
              id="symptoms-title"
              className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-asphalt"
            >
              {symptomsContent.title}
            </h2>
          </div>

          <p className="font-mono text-xs uppercase tracking-wider text-asphalt/70 max-w-xs md:text-right">
            {symptomsContent.subtitle}
          </p>
        </div>

        {/* Interactive Layout: Left Problem List, Right Dynamic Image Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Giant Problem Statements */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-asphalt/15 border-y border-asphalt/15">
            {symptomsContent.items.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group py-6 sm:py-7 cursor-pointer transition-all duration-200 ${
                    isSelected ? "opacity-100 pl-2" : "opacity-35 hover:opacity-75"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={item.phrase}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Red Marker beside active item */}
                      <div
                        className={`w-2 h-2 bg-signal-red transition-opacity duration-150 ${
                          isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                        }`}
                      />
                      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-asphalt">
                        {item.phrase}
                      </h3>
                    </div>

                    {/* Red Marker label */}
                    <div
                      className={`hidden sm:flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-signal-red transition-opacity duration-150 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <span>{symptomsContent.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Subtext and Mobile Image Drawer */}
                  <div
                    className={`mt-2.5 pl-5 transition-all duration-200 ${
                      isSelected ? "block" : "hidden sm:block text-asphalt/50"
                    }`}
                  >
                    <p className="text-sm font-normal text-asphalt/80 max-w-lg">
                      {item.subtext}
                    </p>

                    {/* Mobile Only: Image appears directly underneath when tapped */}
                    {isSelected && (
                      <div className="mt-4 lg:hidden rounded-none overflow-hidden border border-asphalt/20 shadow-md">
                        <div className="relative h-56 w-full bg-asphalt">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                        <div className="p-3 bg-asphalt text-road-white font-mono text-xs flex items-center justify-between border-t border-white/10">
                          <span className="text-metal">{symptomsContent.diagnosticTargetPrefix}</span>
                          <span className="text-road-white font-semibold">{item.investigation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Desktop Image Display with Clean Technical Cues */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <div className="border border-asphalt/25 bg-asphalt text-road-white shadow-xl overflow-hidden">
              {/* Photo Frame */}
              <div className="relative h-96 w-full overflow-hidden bg-black/40">
                <Image
                  src={symptomsContent.items[activeIndex].image}
                  alt={symptomsContent.items[activeIndex].alt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt/90 via-transparent to-transparent" />

                {/* Inspection crosshair cue */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-white/70 uppercase tracking-widest bg-black/60 px-2 py-1 border border-white/10">
                  REF: FIG-{activeIndex + 1}.0
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-[11px] text-signal-red uppercase tracking-wider font-semibold">
                    INSPECTION PROTOCOL:
                  </div>
                  <div className="font-display text-sm font-bold uppercase text-road-white mt-0.5">
                    {symptomsContent.items[activeIndex].investigation}
                  </div>
                </div>
              </div>

              {/* Technical Caption Box */}
              <div className="p-4 border-t border-white/10 bg-asphalt flex items-center justify-between font-mono text-xs text-metal">
                <span>{symptomsContent.intakePrefix}{(activeIndex + 1) * 110}</span>
                <span className="text-signal-red">{symptomsContent.intakeSuffix}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Trust-Building Moment */}
        <div className="mt-16 pt-12 border-t border-asphalt/20 max-w-4xl mx-auto text-center">
          <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-asphalt leading-snug">
            {symptomsContent.quote}
          </blockquote>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-asphalt/60">
            {symptomsContent.quoteAuthor}
          </p>
        </div>
      </div>
    </section>
  );
}
