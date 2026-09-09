"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { ArrowRight } from "lucide-react";

import { symptomsContent, companyInfo } from "@/data/content";

export default function SymptomsSection() {
  const { setIsBookingOpen, setBookingService, setActiveTone } = useAir();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Update navbar tone to white when this section is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTone("white");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [setActiveTone]);

  return (
    <section
      id="indoor-air"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#FBFBF8] py-28 sm:py-36 px-6 sm:px-10 lg:px-16 flex flex-col justify-center transition-colors duration-700"
      aria-label="Diagnosing Comfort Symptoms"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Tag */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#202321]/50">
            {symptomsContent.overline}
          </span>
          <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#202321] mt-3 font-sans leading-[0.92]">
            {symptomsContent.headlineLine1}
            <br />
            {symptomsContent.headlineLine2}
            <br />
            <span className="text-[#607F87]">{symptomsContent.headlineHighlight}</span>
          </h2>
        </div>

        {/* Vertical Stack of Ordinary Situations */}
        <div className="my-16 sm:my-20 space-y-6 sm:space-y-8">
          {symptomsContent.symptoms.map((symptom, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={symptom.text}
                onMouseEnter={() => setActiveIndex(idx)}
                className="relative cursor-default group py-3 transition-transform duration-300"
              >
                {/* Temperature Shadow appearing behind the sentence */}
                <div
                  className="absolute inset-0 -inset-x-4 sm:-inset-x-8 rounded-none transition-all duration-500 pointer-events-none filter blur-xl"
                  style={{
                    backgroundColor: isActive ? symptom.shadowColor : "transparent",
                    opacity: isActive ? 1 : 0,
                  }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6 border-b border-[#202321]/10 pb-4">
                  <span
                    className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight transition-colors duration-300 font-sans ${
                      isActive ? "text-[#202321]" : "text-[#202321]/35 hover:text-[#202321]/75"
                    }`}
                  >
                    {symptom.text}
                  </span>

                  {/* Context Note */}
                  <span
                    className={`text-xs sm:text-sm font-medium tracking-wide transition-opacity duration-300 max-w-sm ${
                      isActive ? "opacity-90 text-[#202321]" : "opacity-0 md:opacity-30 text-[#202321]/60"
                    }`}
                  >
                    {symptom.context}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calm Reassuring Closing Copy & CTA */}
        <div className="pt-8 sm:pt-12 border-t border-[#202321]/15 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 space-y-3">
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#202321] font-light leading-relaxed">
              {symptomsContent.closingLead1}
              <span className="font-serif italic font-normal text-[#202321]">{symptomsContent.closingItalic1}</span>
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#202321] font-light leading-relaxed">
              {symptomsContent.closingLead2}
              <span className="font-serif italic font-normal text-[#607F87]">{symptomsContent.closingItalic2}</span>
            </p>
            <p className="pt-2 text-sm text-[#202321]/65 max-w-lg">
              {symptomsContent.closingDescription}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => {
                setBookingService(symptomsContent.symptoms[activeIndex].text);
                setIsBookingOpen(true);
              }}
              className="group inline-flex items-center justify-between px-7 py-4 bg-[#202321] text-[#F4F1E9] text-xs uppercase tracking-widest font-semibold hover:bg-[#607F87] transition-all duration-300"
            >
              <span>{symptomsContent.bookCta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <a
              href={`tel:${companyInfo.phoneTel}`}
              className="text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-[#202321]/70 hover:text-[#202321]"
            >
              {symptomsContent.callPrefix}{companyInfo.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
