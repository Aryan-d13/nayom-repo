"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { nightChangesContent } from "@/data/content";

interface TimeMomentProps {
  time: string;
  phrase: string;
  subtext: string;
  image: string;
  alt: string;
  alignment: "left" | "center" | "right";
  index: number;
}

function TimeMoment({
  time,
  phrase,
  subtext,
  image,
  alt,
  alignment,
  index,
}: TimeMomentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Vertical displacement animation
  const timeY = useTransform(scrollYProgress, [0, 0.45, 0.9], [70, 0, -50]);
  const phraseY = useTransform(scrollYProgress, [0, 0.5, 0.9], [100, 0, -60]);
  const imgY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.35, 0.65, 0.95], [0, 1, 1, 0.15]);

  return (
    <div
      ref={containerRef}
      className="min-h-[75vh] sm:min-h-[90vh] w-full flex flex-col justify-center px-4 sm:px-8 md:px-16 py-16 relative overflow-hidden"
    >
      <div
        className={`max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
          alignment === "right" ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Storytelling Typography */}
        <motion.div
          style={{ opacity }}
          className={`md:col-span-7 flex flex-col ${
            alignment === "right"
              ? "md:col-start-6 md:text-right items-end"
              : alignment === "center"
              ? "md:col-span-8 md:col-start-3 text-center items-center"
              : "md:col-span-7 items-start"
          }`}
        >
          {/* Time indicator (storytelling piece) */}
          <motion.div style={{ y: timeY }} className="overflow-hidden mb-2">
            <span className="font-mono text-xl sm:text-2xl md:text-3xl tracking-[0.22em] text-[#E6C875] font-medium block">
              {time}
            </span>
          </motion.div>

          {/* Large phrase with large vertical displacement */}
          <motion.div style={{ y: phraseY }} className="overflow-hidden">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight text-[#F7F2E8] uppercase leading-[0.92]">
              {phrase}
            </h2>
          </motion.div>

          <p className="mt-4 text-sm sm:text-base font-mono tracking-widest text-[#B7AEA0] max-w-sm uppercase">
            {subtext}
          </p>
        </motion.div>

        {/* Tiny snippet of restaurant imagery */}
        <motion.div
          style={{ y: imgY, opacity }}
          className={`md:col-span-5 flex ${
            alignment === "right"
              ? "md:col-start-1 md:row-start-1 justify-start"
              : alignment === "center"
              ? "hidden"
              : "justify-end"
          }`}
        >
          <div className="relative w-48 sm:w-64 md:w-72 aspect-[4/5] p-2 bg-[#242120] border border-[#B7AEA0]/15 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="relative w-full h-full overflow-hidden bg-[#171514]">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 768px) 240px, 320px"
                className="object-cover contrast-110 brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/60 via-transparent to-transparent" />
            </div>
            {/* Timestamp sticker */}
            <div className="absolute -bottom-2.5 -right-2.5 bg-[#702F35] text-[#F7F2E8] font-mono text-[10px] tracking-widest px-2.5 py-0.5 uppercase shadow">
              FRAME #{index + 1}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function NightChangesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#171514] text-[#F7F2E8] night-grain transition-colors duration-700 py-16 sm:py-24"
    >
      {/* Narrative Transition Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 border-b border-[#B7AEA0]/15 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.24em] text-[#E6C875] uppercase block mb-1">
            {nightChangesContent.eyebrow}
          </span>
          <p className="text-xl sm:text-2xl font-serif italic text-[#B7AEA0]">
            {nightChangesContent.heading}
          </p>
        </div>
        <div className="text-[11px] font-mono tracking-[0.2em] text-[#B7AEA0]/60 uppercase">
          {nightChangesContent.timeline}
        </div>
      </div>

      {/* Time Sequence Moments */}
      <div className="divide-y divide-[#B7AEA0]/10">
        {nightChangesContent.moments.map((moment, idx) => (
          <TimeMoment
            key={moment.time}
            index={idx}
            time={moment.time}
            phrase={moment.phrase}
            subtext={moment.subtext}
            image={moment.image}
            alt={moment.alt}
            alignment={moment.alignment}
          />
        ))}
      </div>
    </section>
  );
}
