"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Maximize2, Sparkles } from "lucide-react";
import { projectCollageContent, ProjectItem } from "@/data/content";

const projects: ProjectItem[] = projectCollageContent.projects;

export default function ProjectCollage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Asymmetric drift speeds
  const yFast = useTransform(scrollYProgress, [0, 1], ["-20px", "20px"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["15px", "-15px"]);
  const yDrift = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative bg-[#F3F0E8] text-[#11110F] py-24 md:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B] ring-2 ring-[#11110F]/15" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#66665E]">
              {projectCollageContent.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#11110F]">
            {projectCollageContent.headline}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#55554D] leading-relaxed">
            {projectCollageContent.description}
          </p>
        </div>

        {/* Asymmetric Composition Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start relative">
          {/* 1. HUGE IMAGE: Kitchen (cols 1-7) */}
          <motion.div
            style={{ y: ySlow }}
            onClick={() => handleToggleExpand("kitchen")}
            className={`md:col-span-7 relative group cursor-pointer transition-all duration-500 ${
              expandedId === "kitchen" ? "z-30 scale-[1.03]" : "z-10"
            }`}
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#E2DDD2] border border-[#D5CFC1] shadow-xs">
              <Image
                src={projects[0].image}
                alt={projects[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FFFFFF]">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#BDF45B] uppercase block">
                    {projects[0].room} · {projects[0].neighborhood}
                  </span>
                  <p className="text-sm font-medium tracking-tight text-[#FFFFFF]">{projects[0].detail}</p>
                </div>
                <span className="text-[10px] font-mono text-[#D8D5CC] opacity-70 group-hover:opacity-100 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 2. NARROW VERTICAL IMAGE: Entry (cols 8-12) */}
          <motion.div
            style={{ y: yFast }}
            onClick={() => handleToggleExpand("entry")}
            className={`md:col-span-5 relative group cursor-pointer transition-all duration-500 md:-mt-8 ${
              expandedId === "entry" ? "z-30 scale-[1.03]" : "z-10"
            }`}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E2DDD2] border border-[#D5CFC1] shadow-xs">
              <Image
                src={projects[1].image}
                alt={projects[1].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FFFFFF]">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#BDF45B] uppercase block">
                    {projects[1].room} · {projects[1].neighborhood}
                  </span>
                  <p className="text-sm font-medium tracking-tight text-[#FFFFFF]">{projects[1].detail}</p>
                </div>
                <span className="text-[10px] font-mono text-[#D8D5CC] opacity-70 group-hover:opacity-100 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 3. SMALLER IMAGE: Living Room (cols 1-5, overlapping slightly) */}
          <motion.div
            style={{ y: yDrift }}
            onClick={() => handleToggleExpand("living")}
            className={`md:col-span-5 relative group cursor-pointer transition-all duration-500 md:-mt-12 ${
              expandedId === "living" ? "z-30 scale-[1.03]" : "z-20"
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E2DDD2] border border-[#D5CFC1] shadow-xs">
              <Image
                src={projects[2].image}
                alt={projects[2].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FFFFFF]">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#BDF45B] uppercase block">
                    {projects[2].room} · {projects[2].neighborhood}
                  </span>
                  <p className="text-sm font-medium tracking-tight text-[#FFFFFF]">{projects[2].detail}</p>
                </div>
                <span className="text-[10px] font-mono text-[#D8D5CC] opacity-70 group-hover:opacity-100 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 4. SMALLER IMAGE: Garage (cols 6-12) */}
          <motion.div
            style={{ y: ySlow }}
            onClick={() => handleToggleExpand("garage")}
            className={`md:col-span-7 relative group cursor-pointer transition-all duration-500 md:mt-4 ${
              expandedId === "garage" ? "z-30 scale-[1.03]" : "z-10"
            }`}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2DDD2] border border-[#D5CFC1] shadow-xs">
              <Image
                src={projects[3].image}
                alt={projects[3].alt}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#FFFFFF]">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#BDF45B] uppercase block">
                    {projects[3].room} · {projects[3].neighborhood}
                  </span>
                  <p className="text-sm font-medium tracking-tight text-[#FFFFFF]">{projects[3].detail}</p>
                </div>
                <span className="text-[10px] font-mono text-[#D8D5CC] opacity-70 group-hover:opacity-100 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
