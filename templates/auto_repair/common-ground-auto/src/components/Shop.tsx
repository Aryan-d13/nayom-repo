"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { shopContent } from "@/data/content";

export default function Shop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [alignmentFactor, setAlignmentFactor] = useState(0); // 0 = imperfect, 1 = perfectly aligned

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate relative position of section center to window center
      const sectionCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(sectionCenter - windowCenter);
      const threshold = windowHeight * 0.75;

      if (distance < threshold) {
        // Peaks at 1 when distance is 0, drops smoothly to 0 as it leaves center
        const factor = Math.max(0, 1 - distance / threshold);
        // Smooth sine ease
        setAlignmentFactor(Math.sin((factor * Math.PI) / 2));
      } else {
        setAlignmentFactor(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When alignmentFactor is 1, offset is 0 (snaps into one coherent grid)
  // When alignmentFactor is 0, offset is maximum (imperfect staggered photo wall)
  const imperfectRatio = 1 - alignmentFactor;

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="relative bg-asphalt text-road-white py-24 sm:py-36 border-b border-white/10 overflow-hidden select-none"
      aria-labelledby="shop-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-metal mb-3">
            <span className="w-2 h-2 bg-signal-red" />
            <span>{shopContent.step}</span>
          </div>
          <h2
            id="shop-title"
            className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-road-white"
          >
            {shopContent.title}
          </h2>
          <p className="mt-4 font-sans text-lg sm:text-xl text-road-white max-w-2xl font-medium leading-relaxed">
            {shopContent.description}
          </p>
          <div className="mt-3 font-mono text-xs text-metal uppercase tracking-wider">
            {shopContent.addressLine}
          </div>
        </div>

        {/* Scroll-Driven Photo Wall
            As user scrolls: photographs slide into alignment to form one coherent rectangular composite, then separate */}
        <div className="relative mt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 transition-all duration-300 ease-out">
            {/* 1. Large Horizontal: Bay with Car on Lift (cols 1-8) */}
            <div
              className="md:col-span-8 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden border border-white/20 bg-black/40 shadow-xl transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translate(${imperfectRatio * -16}px, ${imperfectRatio * 12}px) rotate(${
                  imperfectRatio * -1.2
                }deg)`,
              }}
            >
              <Image
                src={shopContent.bays.bay1.image}
                alt={shopContent.bays.bay1.alt}
                fill
                className="object-cover object-center brightness-95"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-asphalt/80 px-2 py-1 text-road-white border border-white/10">
                {shopContent.bays.bay1.label}
              </div>
            </div>

            {/* 2. Narrow Portrait: Mechanic Working (cols 9-12) */}
            <div
              className="md:col-span-4 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden border border-white/20 bg-black/40 shadow-xl transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translate(${imperfectRatio * 18}px, ${imperfectRatio * -14}px) rotate(${
                  imperfectRatio * 1.5
                }deg)`,
              }}
            >
              <Image
                src={shopContent.bays.mechanic.image}
                alt={shopContent.bays.mechanic.alt}
                fill
                className="object-cover object-center brightness-95"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-asphalt/80 px-2 py-1 text-road-white border border-white/10">
                {shopContent.bays.mechanic.label}
              </div>
            </div>

            {/* 3. Smaller Crop A: Tools on Bench (cols 1-5) */}
            <div
              className="md:col-span-5 relative h-56 sm:h-72 overflow-hidden border border-white/20 bg-black/40 shadow-xl transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translate(${imperfectRatio * -14}px, ${imperfectRatio * -16}px) rotate(${
                  imperfectRatio * 1.0
                }deg)`,
              }}
            >
              <Image
                src={shopContent.bays.tools.image}
                alt={shopContent.bays.tools.alt}
                fill
                className="object-cover object-center brightness-95"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-asphalt/80 px-2 py-1 text-road-white border border-white/10">
                {shopContent.bays.tools.label}
              </div>
            </div>

            {/* 4. Smaller Crop B: Wheel & Brake in Bay (cols 6-12) */}
            <div
              className="md:col-span-7 relative h-56 sm:h-72 overflow-hidden border border-white/20 bg-black/40 shadow-xl transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translate(${imperfectRatio * 16}px, ${imperfectRatio * 14}px) rotate(${
                  imperfectRatio * -1.0
                }deg)`,
              }}
            >
              <Image
                src={shopContent.bays.wheels.image}
                alt={shopContent.bays.wheels.alt}
                fill
                className="object-cover object-center brightness-95"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest bg-asphalt/80 px-2 py-1 text-road-white border border-white/10">
                {shopContent.bays.wheels.label}
              </div>
            </div>
          </div>

          {/* Alignment Indicator Badge */}
          <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-metal uppercase tracking-widest border-t border-white/10 pt-3">
            <span>{shopContent.documentaryTag}</span>
            <span className="hidden sm:inline">
              ALIGNMENT STATUS: {alignmentFactor > 0.85 ? shopContent.alignedStatus : shopContent.unalignedStatus}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
