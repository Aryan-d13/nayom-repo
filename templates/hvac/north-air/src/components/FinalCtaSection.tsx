"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { ArrowRight, Phone } from "lucide-react";
import { finalCtaContent, companyInfo } from "@/data/content";

export default function FinalCtaSection() {
  const { setIsBookingOpen, setBookingService, setActiveTone } = useAir();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTone("warm");
            const timer = setTimeout(() => {
              setIsSettled(true);
            }, 1200);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setActiveTone]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#202321] text-[#F4F1E9] py-28 sm:py-36 px-6 sm:px-10 lg:px-16 flex flex-col justify-between overflow-hidden"
      aria-label="Final Comfort CTA - Right Here"
    >
      {/* Dusk Living Room Background Image */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src={finalCtaContent.duskImage}
          alt={finalCtaContent.duskImageAlt}
          fill
          sizes="100vw"
          className={`object-cover object-center transition-all duration-[2200ms] ease-out ${
            isSettled
              ? "filter brightness-[0.72] contrast-[0.98] saturate-[1.12]"
              : "filter brightness-[0.55] contrast-[1.15] saturate-[0.8]"
          }`}
        />

        {/* Shifting Environmental Light from slight discomfort to warm serene stillness */}
        <div
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-out pointer-events-none bg-gradient-to-t from-[#202321] via-[#202321]/60 to-transparent ${
            isSettled ? "opacity-75" : "opacity-90"
          }`}
        />

        {/* Warm Golden Dusk Hearth Glow */}
        <div
          className={`absolute bottom-0 right-0 w-2/3 h-2/3 bg-radial from-[#E5B28D]/25 via-transparent to-transparent pointer-events-none transition-opacity duration-[2800ms] ${
            isSettled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Top Quiet Label */}
      <div className="relative z-20 max-w-6xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-6">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/50">
          {finalCtaContent.overline}
        </span>
        <span className="text-xs font-mono tracking-widest text-[#E5B28D]">
          {isSettled ? finalCtaContent.settledState : finalCtaContent.balancingState}
        </span>
      </div>

      {/* Center Copy and Emotional Serif Statement */}
      <div className="relative z-20 max-w-6xl mx-auto w-full my-auto py-16 sm:py-20">
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-[#FBFBF8] leading-[0.88] font-sans">
          {finalCtaContent.headlineLine1}
          <br />
          {finalCtaContent.headlineLine2}
          <br />
          <span className="text-[#E5B28D]">{finalCtaContent.headlineHighlight}</span>
        </h2>

        {/* Emotional Serif Lines */}
        <div className="mt-8 sm:mt-12 space-y-1 sm:space-y-2 border-l-2 border-[#E5B28D] pl-6 max-w-xl">
          <p className="text-2xl sm:text-4xl font-serif italic text-[#FBFBF8]/95 font-normal">
            {finalCtaContent.serifLine1}
          </p>
          <p className="text-2xl sm:text-4xl font-serif italic text-[#FBFBF8]/95 font-normal">
            {finalCtaContent.serifLine2}
          </p>
          <p className="text-2xl sm:text-4xl font-serif italic text-[#E5B28D] font-normal">
            {finalCtaContent.serifLine3}
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-lg">
          <button
            onClick={() => {
              setBookingService("Complete Home Comfort Visit");
              setIsBookingOpen(true);
            }}
            className="group flex-1 inline-flex items-center justify-between px-8 py-5 bg-[#F4F1E9] text-[#202321] text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-[#E5B28D] transition-colors duration-300 shadow-xl"
          >
            <span>{finalCtaContent.bookCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href={`tel:${companyInfo.phoneTel}`}
            className="inline-flex items-center justify-center gap-3 px-7 py-5 border border-white/20 text-[#FBFBF8] text-xs sm:text-sm font-medium tracking-wide hover:border-white/60 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#E5B28D]" />
            <span>{companyInfo.phone}</span>
          </a>
        </div>
      </div>

      {/* Stillness Note */}
      <div className="relative z-20 max-w-6xl mx-auto w-full pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
        <p>{finalCtaContent.subnote}</p>
        <p className="hidden sm:block">{companyInfo.shortLocation}</p>
      </div>
    </section>
  );
}
