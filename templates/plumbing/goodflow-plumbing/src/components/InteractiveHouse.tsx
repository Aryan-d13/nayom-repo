"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Phone } from "lucide-react";
import { COMPANY, ROOM_STORIES, interactiveHouseContent } from "@/data/content";

interface InteractiveHouseProps {
  onOpenBooking: (roomName?: string) => void;
}

export function InteractiveHouse({ onOpenBooking }: InteractiveHouseProps) {
  const [activeRoomId, setActiveRoomId] = useState<string>("kitchen");

  const activeRoom =
    ROOM_STORIES.find((r) => r.id === activeRoomId) || ROOM_STORIES[0];

  return (
    <section
      id="house-map"
      className="relative bg-[#F4F0E7] text-[#15212A] py-20 sm:py-28 md:py-32 overflow-hidden border-t border-[#15212A]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#397A91] block mb-2 font-semibold">
              {interactiveHouseContent.sectionNumber}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#15212A] leading-[1.05]">
              {interactiveHouseContent.headingPrefix}{" "}
              <span className="font-serif italic text-[#397A91] block sm:inline">
                {interactiveHouseContent.headingHighlight}
              </span>
            </h2>
          </div>

          <p className="text-base text-[#15212A]/75 max-w-md font-normal leading-relaxed">
            {interactiveHouseContent.description}
          </p>
        </div>

        {/* Room Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-12 border-b border-[#15212A]/10 pb-4">
          {ROOM_STORIES.map((room) => {
            const isSelected = activeRoom.id === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveRoomId(room.id)}
                className={`group relative px-4 py-2 text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#15212A] text-[#F4F0E7]"
                    : "bg-white/70 text-[#15212A]/70 hover:text-[#15212A] hover:bg-white border border-[#15212A]/10"
                }`}
              >
                <span>{room.name}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeRoomUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#397A91]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 Cols): Warm Editorial Photography with Smooth Crossfade */}
          <div className="lg:col-span-7">
            <div className="relative aspect-4/3 sm:aspect-16/11 w-full bg-[#E8DFD0] border border-[#15212A]/15 overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRoom.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeRoom.photo}
                    alt={activeRoom.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15212A]/60 via-transparent to-transparent pointer-events-none" />

                  {/* Micro label badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#F4F0E7]">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest uppercase text-[#D8E9EA] block">
                        {interactiveHouseContent.residenceLabel}
                      </span>
                      <p className="text-sm font-normal text-white mt-0.5">
                        {activeRoom.name}
                      </p>
                    </div>

                    <span className="text-xs font-mono text-white/80 bg-[#15212A]/80 px-2.5 py-1 border border-white/20">
                      {activeRoom.subtitle}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column (5 Cols): Clean, Honest Plumber Copy & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoom.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Room Title */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#15212A]">
                    {activeRoom.name}
                  </h3>
                  <p className="font-serif italic text-lg sm:text-xl text-[#397A91] mt-1">
                    {activeRoom.subtitle}
                  </p>
                </div>

                {/* Honest description */}
                <p className="text-base sm:text-lg text-[#15212A]/85 font-normal leading-relaxed border-l-2 border-[#397A91] pl-4">
                  {activeRoom.description}
                </p>

                {/* Common Fixes Checklist */}
                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-[#15212A]/60 mb-3 font-mono">
                    {interactiveHouseContent.fixesHeading}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeRoom.commonFixes.map((fix) => (
                      <li
                        key={fix}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#15212A]/90 font-normal"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#D8E9EA] text-[#397A91] flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-[#15212A]/10 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenBooking(activeRoom.name)}
                    className="group inline-flex items-center gap-2.5 bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] px-6 py-3.5 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs"
                  >
                    <span>{interactiveHouseContent.bookButtonPrefix} {activeRoom.name} {interactiveHouseContent.bookButtonSuffix}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#D8E9EA]" />
                  </button>

                  <a
                    href={COMPANY.phoneRaw}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#15212A] hover:text-[#397A91] transition-colors py-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#397A91]" />
                    <span>{COMPANY.phone}</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
