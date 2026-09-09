"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useAir } from "@/context/AirContext";
import { Wrench, ShieldCheck, Thermometer } from "lucide-react";
import { technicianLoupeContent } from "@/data/content";

export default function TechnicianLoupeSection() {
  const { setActiveTone } = useAir();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState({ x: 240, y: 320 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTone("paper");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setActiveTone]);

  const handlePointer = (clientX: number, clientY: number) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setMousePos({ x, y });
  };

  return (
    <section
      id="the-work"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#F4F1E9] py-28 sm:py-36 px-6 sm:px-10 lg:px-16 flex flex-col justify-center border-t border-[#202321]/15"
      aria-label="The Work - Craftsmanship and Honesty"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Editorial Headline & Narrative */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#202321]/55">
              {technicianLoupeContent.overline}
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#202321] mt-3 font-sans leading-[0.92]">
              {technicianLoupeContent.headlineLine1}
              <br />
              {technicianLoupeContent.headlineLine2}
              <br />
              <span className="font-serif italic font-normal text-[#607F87]">
                {technicianLoupeContent.headlineHighlight}
              </span>
            </h2>
          </div>

          <p className="text-lg sm:text-xl text-[#202321]/85 font-light leading-relaxed max-w-lg">
            {technicianLoupeContent.leadText}
          </p>

          <div className="space-y-4 pt-4 border-t border-[#202321]/15 text-xs sm:text-sm text-[#202321]/75">
            {technicianLoupeContent.bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#202321] mt-2" />
                <p>
                  <strong className="text-[#202321] font-semibold">{bullet.title}</strong> {bullet.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-xs text-[#202321]/50 uppercase tracking-widest">
              {technicianLoupeContent.hintText}
            </p>
          </div>
        </div>

        {/* Right: Editorial Photo with Interactive Circular Loupe */}
        <div className="lg:col-span-7 relative flex justify-center">
          <div
            ref={photoRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={(e) => handlePointer(e.clientX, e.clientY)}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handlePointer(e.touches[0].clientX, e.touches[0].clientY);
                setIsHovered(true);
              }
            }}
            className="relative w-full max-w-xl h-[520px] sm:h-[640px] overflow-hidden border border-[#202321]/20 shadow-sm cursor-crosshair select-none"
          >
            {/* Base Image (Editorial Candids of work in home) */}
            <Image
              src={technicianLoupeContent.image}
              alt={technicianLoupeContent.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover object-center filter brightness-[0.93] contrast-[0.98]"
            />

            {/* Subtle base vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#202321]/40 via-transparent to-transparent pointer-events-none" />

            {/* Circular Reveal Loupe Window (Brightened, high contrast detail) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                clipPath: `circle(88px at ${mousePos.x}px ${mousePos.y}px)`,
              }}
            >
              <Image
                src={technicianLoupeContent.image}
                alt="Detail inspection"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center scale-[1.08] filter brightness-[1.14] contrast-[1.08]"
              />
              {/* Loupe lens ring border */}
              <div
                className="absolute w-[176px] h-[176px] rounded-full border border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.35)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                }}
              />
            </div>

            {/* Caption badge */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-mono tracking-widest text-[#FBFBF8] bg-[#202321]/70 px-3 py-1.5 backdrop-blur-xs">
                {technicianLoupeContent.badgeText}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#FBFBF8]/80 hidden sm:inline-block">
                {technicianLoupeContent.badgeSub}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
