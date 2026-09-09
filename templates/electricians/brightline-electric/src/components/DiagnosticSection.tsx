"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { diagnosticContent, DiagnosticItem } from "@/data/content";

interface DiagnosticSectionProps {
  onOpenBookingWithService: (serviceName: string) => void;
}

const diagnosticItems: DiagnosticItem[] = diagnosticContent.items;

export default function DiagnosticSection({ onOpenBookingWithService }: DiagnosticSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section id="services" className="relative bg-[#F3F0E8] text-[#11110F] py-24 md:py-32 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B] ring-2 ring-[#11110F]/10" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#66665E]">
              {diagnosticContent.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#11110F]">
            {diagnosticContent.headline}
          </h2>
          <p className="mt-3 text-[#5A5A52] text-sm sm:text-base max-w-xl font-normal">
            {diagnosticContent.description}
          </p>
        </div>

        {/* Diagnostic Layout: Editorial Lines on Left + Floating Dynamic Image on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Four Large Editorial Lines */}
          <div className="lg:col-span-7 space-y-3">
            {diagnosticItems.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative p-5 sm:p-7 border border-transparent transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-[#E6E1D5] border-[#D8D2C4] shadow-xs"
                      : "hover:bg-[#EBE6DA]/70 border-[#E5E0D3]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h3
                      className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight transition-colors duration-200 ${
                        isSelected ? "text-[#11110F]" : "text-[#4A4A43] group-hover:text-[#11110F]"
                      }`}
                    >
                      {item.phrase}
                    </h3>

                    {/* "WE CAN HELP →" link */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBookingWithService(item.serviceKey);
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#11110F] transition-all duration-300 mt-2 sm:mt-0 ${
                        isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-80 group-hover:translate-x-0"
                      }`}
                    >
                      <span className="border-b border-[#11110F] pb-0.5">{diagnosticContent.helpCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Supporting explanation */}
                  <p
                    className={`mt-2 text-xs sm:text-sm text-[#4A4A42] max-w-xl transition-opacity duration-300 ${
                      isSelected ? "opacity-100 block" : "opacity-0 hidden sm:block sm:opacity-50"
                    }`}
                  >
                    {item.subtext}
                  </p>

                  {/* Mobile-only inline thumbnail */}
                  <div className="block lg:hidden mt-4 pt-2">
                    {isSelected && (
                      <div className="relative w-full h-56 overflow-hidden rounded-xs border border-[#D5CFC1]">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center transition-transform duration-500 hover:scale-102"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Photograph Reveal (Desktop) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative w-full h-[460px] bg-[#11110F] overflow-hidden border border-[#D8D2C4] shadow-sm">
              {diagnosticItems.map((item, index) => {
                const isCurrent = activeIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className={`object-cover object-center transition-transform duration-700 ease-out ${
                        isCurrent ? "scale-102" : "scale-100"
                      }`}
                    />
                    {/* Subtle warm architectural tint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/80 via-transparent to-transparent" />

                    {/* Bottom caption overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[#FFFFFF]">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#BDF45B] block mb-1">
                          {diagnosticContent.sceneLabel}
                        </span>
                        <p className="text-xs text-[#E5E2D9] font-medium max-w-xs">{item.serviceKey}</p>
                      </div>

                      <button
                        onClick={() => onOpenBookingWithService(item.serviceKey)}
                        className="p-2.5 bg-[#FFFFFF] text-[#11110F] rounded-none hover:bg-[#BDF45B] transition-colors"
                        title="Book this service"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
