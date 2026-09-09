"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { ArrowUpRight } from "lucide-react";

import { serviceAtmospheresContent } from "@/data/content";

export default function ServiceAtmospheresSection() {
  const { setActiveTone, setIsBookingOpen, setBookingService } = useAir();
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const current = serviceAtmospheresContent.atmospheres[activeIdx];

  // Sync navbar tone when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTone(current.tone);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [current.tone, setActiveTone]);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: current.bgColor,
        transition: "background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="relative min-h-screen w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden"
      aria-label="Service Atmospheres: Cool, Warm, Breathe"
    >
      {/* Background Room Atmosphere Subtle Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-1000">
        <Image
          src={current.bgImage}
          alt={current.word}
          fill
          sizes="100vw"
          className="object-cover object-center filter grayscale mix-blend-multiply"
        />
      </div>

      {/* Top Atmosphere Controller / Switcher */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#202321]/15 pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#202321]/60">
            {serviceAtmospheresContent.overline}
          </span>
          <p className="text-sm text-[#202321]/80 mt-1">
            {serviceAtmospheresContent.description}
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center gap-2 bg-[#202321]/10 p-1.5 rounded-none" role="tablist">
          {serviceAtmospheresContent.atmospheres.map((atm, idx) => (
            <button
              key={atm.id}
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => {
                setActiveIdx(idx);
                setActiveTone(atm.tone);
              }}
              className={`px-5 py-2 text-xs uppercase font-bold tracking-widest transition-all duration-300 ${
                activeIdx === idx
                  ? "bg-[#202321] text-[#F4F1E9] shadow-sm"
                  : "text-[#202321]/70 hover:text-[#202321]"
              }`}
            >
              {atm.word}
            </button>
          ))}
        </div>
      </div>

      {/* Giant Stationary Word Experience */}
      <div className="relative z-20 my-16 sm:my-24 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.word}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* Massive Stationary Typography filling the viewport width */}
            <h2 className="text-[22vw] font-black tracking-tighter uppercase leading-[0.82] select-none text-[#202321] font-sans">
              {current.word}
            </h2>

            <p className="mt-4 sm:mt-6 text-lg sm:text-2xl font-serif italic text-[#202321]/90 max-w-xl">
              {current.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Service Pairings */}
      <div className="relative z-20 max-w-7xl mx-auto w-full border-t border-[#202321]/15 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 flex flex-col sm:flex-row gap-6 sm:gap-12">
            {current.services.map((srv) => (
              <div
                key={srv}
                onClick={() => {
                  setBookingService(srv);
                  setIsBookingOpen(true);
                }}
                className="group cursor-pointer flex items-baseline gap-3 border-b border-[#202321]/20 pb-2 hover:border-[#202321] transition-colors"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#202321]">
                  {srv}
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#202321]/50 group-hover:text-[#202321] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            ))}
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end">
            <button
              onClick={() => {
                setBookingService(current.services[0]);
                setIsBookingOpen(true);
              }}
              className="px-6 py-3.5 bg-[#202321] text-[#F4F1E9] text-xs uppercase font-semibold tracking-widest hover:bg-[#3E585F] transition-colors"
            >
              {serviceAtmospheresContent.schedulePrefix} {current.word} {serviceAtmospheresContent.scheduleSuffix}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
