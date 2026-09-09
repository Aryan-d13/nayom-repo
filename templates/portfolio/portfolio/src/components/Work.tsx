"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { workContent, Project } from "@/data/content";

const PROJECTS: readonly Project[] = workContent.projects;

export function Work() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Smooth floating cursor follower
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 24 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="work"
      className="relative min-h-screen w-full bg-[#090A0F] py-32 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04]"
    >
      {/* Section Header */}
      <div className="max-w-4xl mb-20">
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase mb-4">
          {workContent.sectionTag}
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#E7E6DF] leading-[1.02]">
          {workContent.heading}
        </h2>
        <p className="mt-4 font-mono text-xs text-[#878993] tracking-wide">
          {workContent.description}
        </p>
      </div>

      {/* Vertical List of Projects */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {PROJECTS.map((proj) => {
          const isHovered = hoveredProject?.id === proj.id;

          return (
            <div
              key={proj.id}
              onMouseEnter={() => setHoveredProject(proj)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(proj)}
              className="group cursor-pointer py-10 sm:py-14 transition-colors duration-300 hover:bg-white/[0.015] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl"
              data-thought="expand build"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Number & Title */}
                <div className="flex items-baseline space-x-6 sm:space-x-10">
                  <span className="font-mono text-sm sm:text-base text-[#8096C7] tracking-widest font-medium">
                    {proj.num}
                  </span>
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#E7E6DF] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                    {proj.title}
                  </h3>
                </div>

                {/* Center: One sentence summary */}
                <div className="lg:max-w-md">
                  <p className="text-sm sm:text-base text-[#878993] group-hover:text-[#E7E6DF] transition-colors duration-200">
                    {proj.oneLiner}
                  </p>
                </div>

                {/* Right: Year & Arrow indicator */}
                <div className="flex items-center space-x-6 self-start lg:self-auto font-mono text-xs sm:text-sm text-[#878993] group-hover:text-[#8096C7] transition-colors">
                  <span>{proj.year}</span>
                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </div>

              {/* Mobile Inline Image Reveal */}
              <div className="mt-6 block lg:hidden rounded-xl overflow-hidden border border-white/[0.08] aspect-[16/9] relative bg-[#101525]">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Floating Preview Window following Cursor */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              x: springX,
              y: springY,
              transform: "translate(40px, -130px)",
            }}
            className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block w-80 h-52 rounded-xl overflow-hidden shadow-2xl shadow-black/90 border border-[#8096C7]/30 bg-[#101525]"
          >
            <div className="relative w-full h-full">
              <Image
                src={hoveredProject.image}
                alt={hoveredProject.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/80 via-transparent to-transparent flex items-end p-3">
                <span className="font-mono text-[11px] text-[#E7E6DF] tracking-wider uppercase">
                  {hoveredProject.title} // {hoveredProject.year}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
