"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ROOMS_CONTENT, RoomItem, roomExplorerContent } from "@/data/content";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface RoomExplorerProps {
  onSelectService: (service: string) => void;
}

export default function RoomExplorer({ onSelectService }: RoomExplorerProps) {
  const [activeRoomId, setActiveRoomId] = useState<string>(ROOMS_CONTENT[0].id);
  const [showBefore, setShowBefore] = useState(false);

  const activeRoom =
    ROOMS_CONTENT.find((r) => r.id === activeRoomId) || ROOMS_CONTENT[0];

  return (
    <section
      id="services"
      className="py-24 md:py-32 px-6 md:px-12 bg-chalk border-t border-stone/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-terracotta" />
            <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
              {roomExplorerContent.sectionNumber}
            </span>
          </div>
          <h2 className="font-sans text-3xl md:text-5xl font-medium tracking-tight text-ink uppercase">
            {roomExplorerContent.heading}
          </h2>
        </div>

        {/* Large Room-Based Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Room Navigation Titles & Copy */}
          <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8">
            {ROOMS_CONTENT.map((room) => {
              const isActive = room.id === activeRoomId;

              return (
                <div
                  key={room.id}
                  onMouseEnter={() => {
                    setActiveRoomId(room.id);
                    setShowBefore(false);
                  }}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    setShowBefore(false);
                  }}
                  className={`group cursor-pointer pb-6 border-b transition-colors duration-300 ${
                    isActive ? "border-ink/30" : "border-stone/40 hover:border-stone"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-ink/40 tracking-wider">
                        0{ROOMS_CONTENT.indexOf(room) + 1}
                      </span>
                      <h3
                        className={`font-sans text-2xl md:text-4xl font-medium tracking-tight uppercase transition-colors duration-200 ${
                          isActive ? "text-ink" : "text-ink/40 group-hover:text-ink/80"
                        }`}
                      >
                        {room.title}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(room.title);
                      }}
                      className={`text-xs font-mono tracking-wider flex items-center gap-1 transition-opacity ${
                        isActive
                          ? "opacity-100 text-terracotta hover:underline"
                          : "opacity-0 group-hover:opacity-60 text-ink"
                      }`}
                    >
                      <span>{roomExplorerContent.inquireLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Room gets terracotta underline */}
                  <div className="relative h-0.5 w-full bg-transparent overflow-hidden my-2">
                    {isActive && (
                      <motion.div
                        layoutId="active-room-underline"
                        className="absolute inset-0 bg-terracotta"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>

                  {/* Room Tagline & Description */}
                  <p
                    className={`font-serif italic text-lg md:text-xl transition-colors duration-300 mt-2 ${
                      isActive ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {room.tagline}
                  </p>

                  {/* Expanded detail only visible for active on desktop / visible on mobile */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-3 overflow-hidden"
                      >
                        <p className="font-sans text-xs md:text-sm text-ink/75 leading-relaxed">
                          {room.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {room.details.map((detail) => (
                            <span
                              key={detail}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone/40 text-[11px] font-mono text-ink/80 rounded-xs"
                            >
                              <CheckCircle2 className="w-3 h-3 text-terracotta" />
                              {detail}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Crossfading Photograph with Before/After peek */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-xs overflow-hidden border border-stone/70 shadow-sm bg-stone/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeRoom.id}-${showBefore ? "before" : "after"}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={showBefore ? activeRoom.beforeImage : activeRoom.image}
                    alt={`${activeRoom.title} remodeling transformation`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* State Badge & Before/After toggle */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 bg-ink/80 text-chalk text-[11px] font-mono tracking-widest uppercase backdrop-blur-xs rounded-xs">
                  {showBefore
                    ? roomExplorerContent.beforeBadge
                    : roomExplorerContent.afterBadge}
                </span>

                <button
                  onClick={() => setShowBefore(!showBefore)}
                  className="px-3 py-1 bg-chalk/90 hover:bg-chalk text-ink text-[11px] font-mono tracking-wider uppercase backdrop-blur-xs rounded-xs border border-ink/20 shadow-xs cursor-pointer transition-all"
                >
                  {showBefore
                    ? roomExplorerContent.viewAfterLabel
                    : roomExplorerContent.compareBeforeLabel}
                </button>
              </div>
            </div>

            {/* Sub-caption */}
            <div className="mt-4 flex items-center justify-between text-xs text-ink/60 font-sans">
              <span>{roomExplorerContent.subCaptionPrefix}</span>
              <span className="font-mono text-[11px] text-terracotta">
                {activeRoom.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
