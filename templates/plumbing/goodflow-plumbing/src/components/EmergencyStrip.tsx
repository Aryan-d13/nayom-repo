"use client";

import React from "react";
import { Phone, AlertCircle } from "lucide-react";
import { COMPANY, emergencyStripContent } from "@/data/content";

export function EmergencyStrip() {
  return (
    <section className="relative w-full bg-[#D85B46] text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10">
        {/* Left: Urgent Reassurance */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            {/* Blinking Live Indicator Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/90 font-medium">
              {emergencyStripContent.badge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-none">
            {emergencyStripContent.heading}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-white/90 font-normal leading-snug">
            {emergencyStripContent.description}
          </p>
        </div>

        {/* Right: Huge Phone Number Direct Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={COMPANY.phoneRaw}
            className="group inline-flex items-center gap-4 bg-white text-[#D85B46] hover:bg-[#F4F0E7] px-6 sm:px-8 py-4 text-xl sm:text-2xl md:text-3xl font-normal tracking-tight transition-all duration-200 shadow-lg cursor-pointer"
          >
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:-rotate-12" />
            <span className="font-mono tracking-normal font-semibold">
              {COMPANY.phone}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
