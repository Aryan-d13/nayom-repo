"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTemperature } from "@/context/TemperatureContext";

import { roomsStoryContent } from "@/data/content";

const ROOMS = roomsStoryContent.rooms;

export default function RoomsStorySection() {
  const { openBooking } = useTemperature();
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  return (
    <section id="rooms" className="relative w-full bg-ink text-white">
      {/* Sticky Room Indicator Header */}
      <div className="sticky top-20 z-30 bg-ink/90 backdrop-blur-md border-b border-white/10 px-6 sm:px-8 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky font-mono">
              {roomsStoryContent.overline}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            {ROOMS.map((room, idx) => (
              <a
                key={room.id}
                href={`#room-${room.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveRoomIndex(idx);
                  document.getElementById(`room-${room.id}`)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer py-1 ${
                  activeRoomIndex === idx
                    ? "text-white font-semibold border-b border-sky"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <span className="font-mono mr-1.5 opacity-60">{room.number}</span>
                <span className="hidden sm:inline">{room.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stacked Full-Bleed Rooms */}
      <div className="relative">
        {ROOMS.map((room, index) => (
          <div
            key={room.id}
            id={`room-${room.id}`}
            className="relative min-h-[90vh] lg:min-h-screen w-full flex items-end justify-start overflow-hidden border-b border-white/10"
          >
            {/* Full-bleed photography */}
            <div className="absolute inset-0 z-0">
              <Image
                src={room.image}
                alt={`${room.name} interior in Phoenix residence`}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />

              {/* Translucent atmospheric color temperature wash */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${room.colorTint}`}
              />
              <div className="absolute inset-0 bg-ink/35" />
            </div>

            {/* Room Story Narrative (Overlay) */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pb-16 lg:pb-24 pt-32">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs sm:text-sm text-sky tracking-widest">
                    [{room.number}]
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-sand font-medium">
                    {room.name}
                  </span>
                </div>

                <h3 className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] mb-6">
                  {room.serifQuote}
                </h3>

                <p className="text-sm sm:text-base text-cream/90 font-light leading-relaxed max-w-xl mb-8">
                  {room.detail}
                </p>

                <button
                  type="button"
                  onClick={() => openBooking(`${roomsStoryContent.balancePrefix}${room.name.toLowerCase()}`)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sky hover:text-white border-b border-sky/50 hover:border-white pb-1 transition-all cursor-pointer"
                >
                  <span>Balance this room</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
