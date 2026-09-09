"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { roomServicesContent, RoomZone } from "@/data/content";

interface RoomServicesProps {
  onOpenBookingWithService: (serviceName: string) => void;
}

const rooms: RoomZone[] = roomServicesContent.rooms;

export default function RoomServices({ onOpenBookingWithService }: RoomServicesProps) {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const activeRoom = rooms[activeRoomIndex];

  return (
    <section id="services-room" className="relative bg-[#11110F] text-[#FFFFFF] py-24 md:py-32 overflow-hidden border-t border-[#22221E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#22221E]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#A8A89E]">
                {roomServicesContent.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#FFFFFF]">
              {roomServicesContent.headline}
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-xs sm:text-sm text-[#8E8E84] max-w-md font-normal">
            {roomServicesContent.description}
          </p>
        </div>

        {/* Unified Composition: House Photographic Layout (Left) + Editorial Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 cols): The Photographic Home Floor Plan */}
          <div className="lg:col-span-7">
            <div className="p-3 bg-[#161613] border border-[#2A2A24] rounded-xs shadow-2xl">
              <div className="grid grid-cols-12 gap-2.5">
                {rooms.map((room, idx) => {
                  const isActive = activeRoomIndex === idx;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoomIndex(idx)}
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 rounded-xs ${room.gridClass} ${
                        isActive
                          ? "ring-2 ring-[#BDF45B] shadow-[0_0_30px_rgba(189,244,91,0.2)] z-10"
                          : "ring-1 ring-[#262620] hover:ring-[#44443A]"
                      }`}
                    >
                      {/* Room Photo */}
                      <Image
                        src={room.image}
                        alt={room.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className={`object-cover object-center transition-all duration-700 ease-out ${
                          isActive
                            ? "scale-103 brightness-105 contrast-105 opacity-100"
                            : "scale-100 brightness-35 contrast-90 opacity-40 hover:opacity-75 hover:brightness-60"
                        }`}
                      />

                      {/* Soft ambient lighting gradient on active room */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/80 via-transparent to-transparent pointer-events-none" />
                      )}

                      {/* Clean Minimalist Room Badge */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#11110F]/85 backdrop-blur-xs border border-[#2D2D27] rounded-xs">
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B] indicator-pulse" />
                          )}
                          <span
                            className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                              isActive ? "text-[#FFFFFF]" : "text-[#88887E]"
                            }`}
                          >
                            {room.name}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
                            isActive
                              ? "bg-[#BDF45B] text-[#11110F] font-semibold"
                              : "bg-[#11110F]/70 text-[#77776E]"
                          }`}
                        >
                          {room.service}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Minimal caption under house plan */}
              <div className="mt-3 px-1 flex items-center justify-between text-[11px] text-[#7A7A70] font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
                  {roomServicesContent.activeSpaceLabel} <strong className="text-[#FFFFFF]">{activeRoom.name}</strong>
                </span>
                <span>{roomServicesContent.clickHint}</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Editorial Room Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-2">
            {/* Room Identifier */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#BDF45B] uppercase font-semibold">
                  ROOM {activeRoom.number} {roomServicesContent.roomCountText}
                </span>
                <span className="text-xs text-[#55554E]">·</span>
                <span className="text-xs font-mono uppercase tracking-wider text-[#A0A094]">
                  {activeRoom.name}
                </span>
              </div>

              {/* Large Service Headline */}
              <h3 className="text-3xl sm:text-4xl font-semibold text-[#FFFFFF] tracking-tight">
                {activeRoom.service.toUpperCase()}
              </h3>

              {/* Serif Italic Quote */}
              <p className="text-lg sm:text-xl font-serif italic text-[#E5E2D9] leading-snug">
                “{activeRoom.headline}”
              </p>

              {/* Plain English Electrician Copy */}
              <p className="text-xs sm:text-sm text-[#C9C6BD] leading-relaxed font-normal pt-1">
                {activeRoom.description}
              </p>

              {/* Checkpoints */}
              <ul className="space-y-2 pt-3">
                {activeRoom.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5 text-xs text-[#D8D5CC]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#BDF45B] shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#22221E] space-y-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onOpenBookingWithService(`${activeRoom.name} - ${activeRoom.service}`)}
                  className="cta-sweep inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFFFFF] text-[#11110F] text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 hover:bg-[#F3F0E8]"
                >
                  <span>{roomServicesContent.explorePrefix} {activeRoom.service}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveRoomIndex((prev) => (prev + 1) % rooms.length)}
                  className="px-4 py-3.5 text-xs text-[#A0A094] hover:text-[#FFFFFF] transition-colors uppercase tracking-wider border border-[#2B2B25] hover:border-[#44443C]"
                >
                  {roomServicesContent.nextRoomText}
                </button>
              </div>

              {/* Quick Room Jump Tabs */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#66665E] mb-2">
                  {roomServicesContent.quickSelectLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {rooms.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveRoomIndex(idx)}
                      className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                        activeRoomIndex === idx
                          ? "bg-[#BDF45B] text-[#11110F] font-semibold"
                          : "bg-[#1C1C18] text-[#88887E] hover:text-[#FFFFFF] hover:bg-[#252520]"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
