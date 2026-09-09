"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { servicesContent } from "@/data/content";

export default function Services() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="relative bg-paper text-asphalt py-24 sm:py-36 border-b border-black/10 paper-texture select-none"
      aria-labelledby="services-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-8 border-b border-asphalt/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-asphalt/60 mb-2">
              <span className="w-2 h-2 bg-signal-red" />
              <span>{servicesContent.step}</span>
            </div>
            <h2
              id="services-title"
              className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-asphalt"
            >
              {servicesContent.title}
            </h2>
          </div>

          <div className="font-mono text-xs uppercase tracking-wider text-asphalt/70 max-w-sm md:text-right">
            <span>{servicesContent.tagline}</span>
          </div>
        </div>

        {/* Clean Service Index Rows (no cards, large horizontal rows) */}
        <div className="divide-y divide-asphalt/20 border-y border-asphalt/20" role="list">
          {servicesContent.items.map((service) => {
            const isHovered = hoveredId === service.id;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId(isHovered ? null : service.id)}
                className={`group transition-all duration-300 ease-in-out cursor-pointer ${
                  isHovered ? "bg-white/40 py-8 sm:py-10" : "py-6 sm:py-7 hover:bg-white/20"
                }`}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHoveredId(isHovered ? null : service.id);
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 sm:px-4">
                  {/* Left: Index & Service Name */}
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-metal font-bold">
                      {service.index}
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-asphalt group-hover:text-black transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  {/* Right: One-line Description & Arrow */}
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10">
                    <p className="font-sans text-sm sm:text-base text-asphalt/80 max-w-md">
                      {service.description}
                    </p>
                    <div
                      className={`w-10 h-10 flex items-center justify-center border transition-all duration-200 ${
                        isHovered
                          ? "bg-signal-red border-signal-red text-white translate-x-1"
                          : "border-asphalt/20 text-asphalt group-hover:border-asphalt"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Narrow Photographic Strip Beneath on Hover */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isHovered ? "max-h-56 mt-6 opacity-100 px-2 sm:px-4" : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={!isHovered}
                >
                  <div className="relative h-40 w-full overflow-hidden border border-asphalt/20 shadow-inner bg-asphalt">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover object-center brightness-90"
                      sizes="(max-width: 1024px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-asphalt/70 via-transparent to-asphalt/50" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-road-white">
                      <CornerDownRight className="w-3.5 h-3.5 text-signal-red" />
                      <span>{service.name} INSPECTION &amp; SERVICE BAY READY</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footnote */}
        <div className="mt-12 flex flex-wrap items-center justify-between font-mono text-xs text-asphalt/60 gap-4">
          <span>{servicesContent.footerLeft}</span>
          <span>{servicesContent.footerRight}</span>
        </div>
      </div>
    </section>
  );
}
