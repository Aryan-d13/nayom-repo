"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { admissionsContent, ADMISSION_ACTIONS } from "@/data/content";

interface AdmissionsSectionProps {
  onSelectAction: (actionId: string) => void;
}

export default function AdmissionsSection({
  onSelectAction,
}: AdmissionsSectionProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <section
      id="admissions"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 bg-[#D76C56] text-[#FFFDF8] overflow-hidden"
    >
      {/* Background subtle paper watermark texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#FFFDF8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#FFFDF8]/80 block mb-3 font-mono">
            {admissionsContent.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-[#FFFDF8] leading-[0.92]">
            {admissionsContent.headingMain} <br />
            <span className="font-serif-title italic font-normal text-[#FFFDF8]">
              {admissionsContent.headingAccent}
            </span>
          </h2>
          <p className="text-base sm:text-xl text-[#FFFDF8]/90 mt-6 leading-relaxed font-sans max-w-xl">
            {admissionsContent.description}
          </p>
        </div>

        {/* Three Large Clickable Action Rows */}
        <div className="flex flex-col divide-y divide-[#FFFDF8]/25 border-y border-[#FFFDF8]/25">
          {ADMISSION_ACTIONS.map((action, idx) => {
            const isHovered = hoveredRow === action.id;
            return (
              <div
                key={action.id}
                onMouseEnter={() => setHoveredRow(action.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onSelectAction(action.id)}
                className="group relative py-8 sm:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer transition-colors duration-300 hover:bg-[#FFFDF8]/10 px-4 sm:px-6 rounded-xl"
                role="button"
                tabIndex={0}
                aria-label={action.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectAction(action.id);
                  }
                }}
              >
                {/* Left: Row Index & Title */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FFFDF8]/60">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#FFFDF8] group-hover:translate-x-2 transition-transform duration-300">
                      {action.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#FFFDF8]/85 mt-2 max-w-md font-sans">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Right: Small Campus Photograph appearing on hover */}
                <div className="flex items-center gap-6 justify-end">
                  <div
                    className={`relative w-36 sm:w-44 aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#FFFDF8] shadow-xl transition-all duration-300 ${
                      isHovered
                        ? "opacity-100 scale-100 -rotate-2"
                        : "opacity-0 scale-90 pointer-events-none md:block hidden"
                    }`}
                  >
                    <Image
                      src={action.image}
                      alt={action.title}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>

                  <div className="w-12 h-12 rounded-full border border-[#FFFDF8]/40 flex items-center justify-center text-[#FFFDF8] group-hover:bg-[#FFFDF8] group-hover:text-[#D76C56] transition-colors shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Phone & Welcoming Note */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#FFFDF8]/70 block">
              {admissionsContent.bottomPhoneLabel}
            </span>
            <a
              href={`tel:${admissionsContent.bottomPhone.replace(/[^0-9]/g, "")}`}
              className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8] hover:underline underline-offset-8 mt-1 inline-block"
            >
              {admissionsContent.bottomPhone}
            </a>
          </div>

          <div className="text-sm text-[#FFFDF8]/85 max-w-sm">
            <p>
              {admissionsContent.bottomNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
