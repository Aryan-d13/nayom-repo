"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Waves } from "lucide-react";
import { followWaterContent } from "@/data/content";

interface FollowTheWaterProps {
  onOpenBooking: (service?: string) => void;
}

const ROOMS = followWaterContent.rooms;

export default function FollowTheWater({ onOpenBooking }: FollowTheWaterProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  // Scroll listener to track progression through section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Calculate active room index from scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map progress [0.2 -> 0.8] to 0, 1, 2, 3
      if (latest < 0.32) {
        setActiveRoomIndex(0);
      } else if (latest < 0.48) {
        setActiveRoomIndex(1);
      } else if (latest < 0.64) {
        setActiveRoomIndex(2);
      } else {
        setActiveRoomIndex(3);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Transform for line progress length
  const lineProgress = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.52, 0.7],
    [0.25, 0.5, 0.75, 1]
  );

  const activeRoom = ROOMS[activeRoomIndex];

  // SVG House pipe path connecting Kitchen -> Bath -> Laundry -> Utility
  // ViewBox: 0 0 1000 750
  const housePath = "M 80 220 L 260 220 C 380 220, 480 180, 560 180 C 640 180, 720 220, 720 220 L 720 380 C 720 440, 650 480, 500 480 C 350 480, 260 480, 260 530 L 260 590 C 260 630, 360 640, 500 640 C 640 640, 720 590, 720 530 L 920 530";

  return (
    <section
      id="follow-the-water"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 bg-[#F3EFE7] border-t border-[#17252A]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-[#68B8C3]" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#17252A]/70">
              {followWaterContent.kicker}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#17252A] uppercase">
            {followWaterContent.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#17252A]/75 font-normal">
            {followWaterContent.description}
          </p>
        </div>

        {/* SIMPLIFIED ILLUSTRATED HOUSE CONTAINER */}
        <div className="relative w-full rounded-3xl bg-[#FFFDF8] border-2 border-[#17252A]/15 p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden">
          {/* Subtle house contour background */}
          <div className="absolute inset-0 pointer-events-none opacity-25 architectural-grid" />

          {/* Roof gable outline hint */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-[#17252A]/20 rounded-full" />

          {/* Interactive Room Selector Tabs */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 pb-8 border-b border-[#17252A]/10 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {ROOMS.map((room, idx) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomIndex(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3] ${
                    activeRoomIndex === idx
                      ? "bg-[#17252A] text-[#FFFDF8] shadow-sm"
                      : "bg-[#F3EFE7]/80 text-[#17252A]/70 hover:text-[#17252A] hover:bg-[#F3EFE7]"
                  }`}
                >
                  <span className="mr-1.5 opacity-50">0{idx + 1}</span>
                  {room.name}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#17252A]/50">
              <span>{followWaterContent.stageLabel}</span>
              <span className="text-[#68B8C3] font-bold">0{activeRoomIndex + 1} / 04</span>
            </div>
          </div>

          {/* Main Display Grid: 4 Rooms Illustrated Cross-Section */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[460px] lg:min-h-[520px]">
            {/* BACKGROUND SVG FLOW LINE ACROSS HOUSE */}
            <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
              <svg
                className="w-full h-full"
                viewBox="0 0 1000 750"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Quiet background trace */}
                <path
                  d={housePath}
                  stroke="#17252A"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  strokeOpacity="0.12"
                />

                {/* Animated active flowing blue water path */}
                <motion.path
                  d={housePath}
                  stroke="#68B8C3"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  style={{ pathLength: lineProgress }}
                  className="filter drop-shadow-[0_0_8px_rgba(104,184,195,0.6)]"
                />

                {/* Active node pulsers */}
                {ROOMS.map((r, i) => (
                  <g key={r.id}>
                    <circle
                      cx={r.cx}
                      cy={r.cy}
                      r={activeRoomIndex === i ? "16" : "6"}
                      fill={activeRoomIndex === i ? "#68B8C3" : "#17252A"}
                      fillOpacity={activeRoomIndex === i ? "0.2" : "0.1"}
                      className={activeRoomIndex === i ? "animate-ping" : ""}
                    />
                    <circle
                      cx={r.cx}
                      cy={r.cy}
                      r={activeRoomIndex === i ? "7" : "4"}
                      fill={activeRoomIndex === i ? "#68B8C3" : "#17252A"}
                      fillOpacity={activeRoomIndex === i ? "1" : "0.3"}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* 4 ROOMS */}
            {ROOMS.map((room, idx) => (
              <div
                key={room.id}
                onClick={() => setActiveRoomIndex(idx)}
                className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                  activeRoomIndex === idx
                    ? "bg-[#DDF0EC]/60 border-[#68B8C3] shadow-md ring-1 ring-[#68B8C3]/30"
                    : "bg-[#F3EFE7]/40 border-[#17252A]/10 hover:border-[#17252A]/25 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono tracking-widest text-[#17252A]/60">
                      {room.zone}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        activeRoomIndex === idx ? "bg-[#68B8C3]" : "bg-[#17252A]/20"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17252A]">
                    {room.name}
                  </h3>
                  <div className="mt-2 text-sm font-semibold tracking-wider text-[#68B8C3]">
                    {room.fixtures}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#17252A]/10">
                  <p className="text-xs sm:text-sm text-[#17252A]/75 leading-relaxed">
                    {room.detail}
                  </p>
                  <div className="mt-2 text-[10px] font-mono uppercase text-[#17252A]/50">
                    {room.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CLIMAX CALLOUT AT THE END OF THE SECTION */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#17252A]/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#C86650] mb-1">
                {followWaterContent.climaxKicker}
              </div>
              <h4 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#17252A] uppercase tracking-tight">
                {followWaterContent.climaxTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#17252A]/70 mt-1 max-w-xl">
                {followWaterContent.climaxDescription}
              </p>
            </div>

            <div>
              <button
                onClick={() => onOpenBooking(followWaterContent.defaultService)}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#17252A] text-[#FFFDF8] hover:bg-[#C86650] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              >
                <span>{followWaterContent.climaxCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#68B8C3] group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
