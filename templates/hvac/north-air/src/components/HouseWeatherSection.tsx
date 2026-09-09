"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { houseWeatherContent, Room } from "@/data/content";

const rooms: Room[] = houseWeatherContent.rooms;

export default function HouseWeatherSection() {
  const { setActiveTone } = useAir();
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Auto-flow ribbon timer or scroll detection
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoomIndex((prev) => (prev + 1) % rooms.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Update tone when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTone("mist");
          }
        });
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setActiveTone]);

  const activeRoom = rooms[activeRoomIndex];

  return (
    <section
      id="heating"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#E3E6E0] py-24 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden"
      aria-label="House Architectural Weather"
    >
      {/* Section Header */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#202321]/15 max-w-7xl mx-auto w-full">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#202321]/60">
            {houseWeatherContent.overline}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#202321] mt-2 font-sans">
            {houseWeatherContent.headline}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#202321]/70 max-w-md">
          {houseWeatherContent.description}
        </p>
      </div>

      {/* Architectural Cutaway Presentation */}
      <div className="relative z-20 my-10 max-w-7xl mx-auto w-full">

        {/* 4-Room Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {rooms.map((room, idx) => {
            const isEmphasized = activeRoomIndex === idx;

            return (
              <div
                key={room.id}
                onClick={() => setActiveRoomIndex(idx)}
                className={`relative group cursor-pointer overflow-hidden border transition-all duration-500 min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col justify-between p-6 sm:p-8 ${
                  isEmphasized
                    ? "border-[#202321] shadow-lg ring-1 ring-[#202321]"
                    : "border-[#202321]/15 opacity-85 hover:opacity-100"
                }`}
              >
                {/* Background Room Image */}
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover object-center transition-transform duration-700 ${
                    isEmphasized ? "scale-105 filter brightness-105" : "scale-100 filter brightness-95"
                  }`}
                />

                {/* Atmospheric Color Field Overlay for this Room */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    backgroundColor: room.bgRgba,
                    opacity: isEmphasized ? 0.88 : 0.65,
                  }}
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#202321]/70 via-transparent to-[#202321]/30" />

                {/* Top: Small Room Label + Target Comfort */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#FBFBF8] bg-[#202321]/60 px-3 py-1 backdrop-blur-xs">
                    {room.title}
                  </span>
                  <span className="text-xs font-mono tracking-widest text-[#FBFBF8]/90 font-medium">
                    {room.temp}
                  </span>
                </div>

                {/* Bottom: Tiny Poetic Sentence that Appears */}
                <div className="relative z-20 pt-12">
                  <AnimatePresence mode="wait">
                    {isEmphasized ? (
                      <motion.div
                        key={`quote-${room.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="bg-[#FBFBF8]/95 p-4 border-l-2 border-[#202321] max-w-sm"
                      >
                        <p className="text-base sm:text-lg lg:text-xl font-serif italic text-[#202321]">
                          {room.quote}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-xs uppercase tracking-wider text-[#FBFBF8]/75 font-semibold">
                        Click to focus zone
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-[#202321]/70 border-t border-[#202321]/15">
        <p>{houseWeatherContent.footerLeft}</p>
        <p className="mt-2 sm:mt-0 font-medium text-[#202321]">
          {houseWeatherContent.footerRight}
        </p>
      </div>
    </section>
  );
}
