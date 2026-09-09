"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FLOOR_PLAN_CONTENT } from "@/data/content";

interface ThePlanProps {
  onOpenProjectModal: () => void;
}

export default function ThePlan({ onOpenProjectModal }: ThePlanProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("kitchen");
  const activeRoom =
    FLOOR_PLAN_CONTENT.rooms.find((r) => r.id === selectedRoomId) ||
    FLOOR_PLAN_CONTENT.rooms[3];

  return (
    <section
      id="the-plan"
      className="py-24 sm:py-32 md:py-40 bg-parchment/60 border-t border-dust/40 relative overflow-hidden"
      aria-label="The Plan: Start With How You Live"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Subtitle */}
        <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-moss font-semibold mb-4">
          {FLOOR_PLAN_CONTENT.sectionTag}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Thoughtful Editorial Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95] text-ink uppercase mb-8">
                {FLOOR_PLAN_CONTENT.headlineLines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < FLOOR_PLAN_CONTENT.headlineLines.length - 1 && <br />}
                  </span>
                ))}
              </h2>

              <p className="font-serif italic text-xl sm:text-2xl text-ink/85 mb-10">
                {FLOOR_PLAN_CONTENT.conversationalSubtitle}
              </p>

              {/* Reflective Homeowner Questions as interactive thought prompts */}
              <div className="space-y-6 mb-12">
                {FLOOR_PLAN_CONTENT.questions.map((item, qIdx) => {
                  const isHighlighted =
                    (qIdx === 0 && selectedRoomId === "kitchen") ||
                    (qIdx === 1 && selectedRoomId === "dining") ||
                    (qIdx === 2 && selectedRoomId === "entry");

                  return (
                    <div
                      key={qIdx}
                      onClick={() => {
                        if (qIdx === 0) setSelectedRoomId("kitchen");
                        if (qIdx === 1) setSelectedRoomId("dining");
                        if (qIdx === 2) setSelectedRoomId("entry");
                      }}
                      className={`p-4 border transition-all duration-200 cursor-pointer ${
                        isHighlighted
                          ? "bg-warm-white border-terracotta/70 shadow-sm"
                          : "bg-warm-white/50 border-dust/60 hover:border-dust"
                      }`}
                    >
                      <p className="font-serif text-lg sm:text-xl text-ink leading-snug">
                        “{item.q}”
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="font-mono text-terracotta uppercase tracking-wider font-semibold">
                          → {item.room}
                        </span>
                        <span className="text-ink/65 text-[11px] italic">
                          {item.note}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Room In-Depth Thought */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRoom.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 bg-warm-white border-l-2 border-moss mb-10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-moss font-bold">
                      {FLOOR_PLAN_CONTENT.selectedPrefix} {activeRoom.name}
                    </span>
                    <span className="font-hand text-lg text-terracotta">
                      * {activeRoom.architectNote}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-ink/80 leading-relaxed">
                    {activeRoom.reflection}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prompt's Required CTA */}
            <div>
              <button
                onClick={onOpenProjectModal}
                className="px-8 py-4 bg-ink text-warm-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-moss active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
              >
                {FLOOR_PLAN_CONTENT.cta}
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Working Floor Plan Sketch */}
          <div className="lg:col-span-7">
            <div className="bg-warm-white p-6 sm:p-10 border border-dust/80 shadow-[0_15px_40px_-20px_rgba(35,35,33,0.12)] relative">
              
              {/* Header inside plan drawing */}
              <div className="flex items-center justify-between pb-6 border-b border-dust/50 mb-6 font-mono text-[10px] tracking-widest text-ink/60 uppercase">
                <span>{FLOOR_PLAN_CONTENT.sketchTitle}</span>
                <span>{FLOOR_PLAN_CONTENT.sketchScale}</span>
              </div>

              {/* Architectural Working Sketch SVG */}
              <div className="relative aspect-[4/3.2] w-full bg-[#FCFBF8] border border-dust/60 p-4">
                
                {/* Subtle paper grid background */}
                <div className="absolute inset-0 bg-pencil-grid opacity-60 pointer-events-none" />

                <svg
                  viewBox="0 0 600 480"
                  className="w-full h-full relative z-10 select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Walls */}
                  <rect
                    x="40"
                    y="40"
                    width="520"
                    height="400"
                    stroke="#232321"
                    strokeWidth="3.5"
                    fill="none"
                  />

                  {/* ROOM 1: ENTRY (Bottom Center) */}
                  <g
                    onClick={() => setSelectedRoomId("entry")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="230"
                      y="320"
                      width="140"
                      height="120"
                      fill={selectedRoomId === "entry" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="300"
                      y="375"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "entry" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      ENTRY
                    </text>
                    {/* Door swing arc */}
                    <path
                      d="M 300 440 A 50 50 0 0 0 350 390"
                      stroke="#687060"
                      strokeWidth="1"
                      fill="none"
                    />
                    <line x1="300" y1="440" x2="300" y2="390" stroke="#687060" strokeWidth="1" />
                  </g>

                  {/* ROOM 2: LIVING (Bottom Left) */}
                  <g
                    onClick={() => setSelectedRoomId("living")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="40"
                      y="200"
                      width="190"
                      height="240"
                      fill={selectedRoomId === "living" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="135"
                      y="315"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "living" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      LIVING
                    </text>
                    {/* Fireplace niche */}
                    <rect x="40" y="280" width="18" height="60" stroke="#232321" strokeWidth="1.5" fill="#EDE8DE" />
                  </g>

                  {/* ROOM 3: DINING (Top Left) */}
                  <g
                    onClick={() => setSelectedRoomId("dining")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="40"
                      y="40"
                      width="190"
                      height="160"
                      fill={selectedRoomId === "dining" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="135"
                      y="125"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "dining" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      DINING
                    </text>
                    {/* Dining table outline */}
                    <rect x="85" y="85" width="100" height="60" rx="4" stroke="#C8C0B4" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  {/* ROOM 4: KITCHEN (Top Center) */}
                  <g
                    onClick={() => setSelectedRoomId("kitchen")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="230"
                      y="40"
                      width="170"
                      height="200"
                      fill={selectedRoomId === "kitchen" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="315"
                      y="135"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "kitchen" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      KITCHEN
                    </text>
                    {/* Island block */}
                    <rect x="270" y="90" width="90" height="45" fill="#EDE8DE" stroke="#232321" strokeWidth="1.2" />
                  </g>

                  {/* ROOM 5: PRIMARY BEDROOM (Right Half Top) */}
                  <g
                    onClick={() => setSelectedRoomId("primary")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="400"
                      y="40"
                      width="160"
                      height="230"
                      fill={selectedRoomId === "primary" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="480"
                      y="145"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "primary" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      PRIMARY
                    </text>
                  </g>

                  {/* ROOM 6: BATH (Right Half Bottom) */}
                  <g
                    onClick={() => setSelectedRoomId("bath")}
                    className="cursor-pointer group"
                  >
                    <rect
                      x="370"
                      y="270"
                      width="190"
                      height="170"
                      fill={selectedRoomId === "bath" ? "rgba(169, 93, 73, 0.15)" : "transparent"}
                      stroke="#232321"
                      strokeWidth="2"
                      className="transition-colors duration-200"
                    />
                    <text
                      x="465"
                      y="360"
                      textAnchor="middle"
                      className={`font-sans text-xs font-bold tracking-[0.2em] transition-colors ${
                        selectedRoomId === "bath" ? "fill-terracotta font-black" : "fill-ink/75"
                      }`}
                    >
                      BATH
                    </text>
                    {/* Soaking tub outline */}
                    <rect x="470" y="380" width="75" height="45" rx="8" stroke="#687060" strokeWidth="1.2" />
                  </g>

                  {/* Architectural Annotations & Dimension Arrows */}
                  <g className="font-hand text-sm fill-ink/80 pointer-events-none">
                    {/* Kitchen annotation */}
                    <path d="M 330 65 L 360 45" stroke="#A95D49" strokeWidth="1" />
                    <text x="365" y="45" fill="#A95D49" className="text-[13px] font-semibold">
                      {FLOOR_PLAN_CONTENT.annotations.kitchenLight}
                    </text>

                    {/* Living to dining opening arrow */}
                    <path
                      d="M 135 190 L 135 210 M 130 195 L 135 190 L 140 195 M 130 205 L 135 210 L 140 205"
                      stroke="#687060"
                      strokeWidth="1.2"
                    />
                    <text x="148" y="204" fill="#687060" className="text-[12px]">
                      {FLOOR_PLAN_CONTENT.annotations.openingDimension}
                    </text>
                  </g>
                </svg>

              </div>

              {/* Click interactive prompt */}
              <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-dust uppercase">
                <span>{FLOOR_PLAN_CONTENT.sketchInstruction}</span>
                <span className="text-terracotta">{FLOOR_PLAN_CONTENT.activeSelectionTag}</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
