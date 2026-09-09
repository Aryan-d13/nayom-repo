"use client";

import { useState } from "react";
import Image from "next/image";
import { Compass } from "lucide-react";
import { diagnosisContent, FocusZone } from "@/data/content";

export default function Diagnosis() {
  const [activeZone, setActiveZone] = useState<FocusZone>(diagnosisContent.zones[0]);

  return (
    <section
      id="diagnosis"
      className="relative bg-asphalt text-road-white py-24 sm:py-32 border-b border-white/10 select-none overflow-hidden"
      aria-labelledby="diagnosis-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-metal mb-3">
            <span className="w-2 h-2 bg-signal-red" />
            <span>{diagnosisContent.step}</span>
          </div>
          <h2
            id="diagnosis-title"
            className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-road-white"
          >
            {diagnosisContent.title}
          </h2>
          <p className="mt-3 text-metal text-base sm:text-lg max-w-xl">
            {diagnosisContent.description}
          </p>
        </div>

        {/* Interactive photographic exploration container */}
        <div className="border border-white/15 bg-black/60 shadow-2xl relative">
          {/* Top Industrial Index Bar */}
          <div className="p-4 sm:px-6 border-b border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-metal">
              <Compass className="w-4 h-4 text-signal-red" />
              <span>{diagnosisContent.interactiveCropPrefix} {activeZone.label} INSPECTION VIEW</span>
            </div>

            {/* Zone Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Vehicle Inspection Points">
              {diagnosisContent.zones.map((zone) => {
                const isActive = activeZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone)}
                    className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-150 border ${
                      isActive
                        ? "bg-signal-red text-white border-signal-red font-bold shadow-xs"
                        : "bg-white/5 text-metal border-white/10 hover:bg-white/10 hover:text-road-white"
                    }`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="diagnosis-view"
                  >
                    {zone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photographic Viewport with Dynamic Crop Transform */}
          <div
            id="diagnosis-view"
            className="relative h-[320px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden bg-asphalt"
          >
            {/* The Vehicle Silhouette Photograph */}
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out will-change-transform"
              style={{
                transform: `scale(${activeZone.scale}) translate(${activeZone.translateX}, ${activeZone.translateY})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={diagnosisContent.vehicleImage}
                alt={diagnosisContent.vehicleImageAlt}
                fill
                priority
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            </div>

            {/* Subtle Vignette & Technical Crosshair Lines */}
            <div className="absolute inset-0 pointer-events-none border border-white/5">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5" />
            </div>

            {/* Active Marker Point on the Car */}
            <div
              className="absolute pointer-events-none transition-all duration-700 ease-out z-20 flex items-center gap-2"
              style={{
                top: activeZone.markerPosition.top,
                left: activeZone.markerPosition.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="w-6 h-6 rounded-full bg-signal-red/30 animate-ping absolute" />
                <span className="w-3.5 h-3.5 rounded-full bg-signal-red border-2 border-white relative shadow-md" />
              </div>
              <div className="bg-asphalt/90 text-road-white border border-white/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest hidden sm:block">
                {activeZone.customerObservation}
              </div>
            </div>

            {/* Bottom Overlay Summary Inside Viewport */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-asphalt via-asphalt/90 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-signal-red font-semibold">
                  {diagnosisContent.commonObservationLabel}
                </span>
                <div className="font-display text-2xl sm:text-4xl font-extrabold uppercase text-road-white mt-1">
                  {activeZone.customerObservation}
                </div>
                <p className="mt-1 font-sans text-xs sm:text-sm text-metal max-w-lg">
                  {activeZone.investigationDetail}
                </p>
              </div>

              <div className="sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-signal-red pl-3 sm:pl-0 sm:pr-3">
                <div className="font-display text-xl sm:text-2xl font-black uppercase text-road-white tracking-wider">
                  {diagnosisContent.weWillFindItHeading}
                </div>
                <div className="font-mono text-xs text-metal uppercase tracking-wider mt-0.5">
                  {diagnosisContent.weWillFindItSub}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footnote Bar */}
          <div className="p-3 sm:px-6 bg-white/5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-metal">
            <span>{diagnosisContent.footerMethod}</span>
            <span>{diagnosisContent.footerProtocol}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
