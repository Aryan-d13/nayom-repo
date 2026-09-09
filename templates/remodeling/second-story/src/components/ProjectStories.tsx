"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PROJECT_STORIES,
  ProjectStory,
  projectStoriesSectionContent,
} from "@/data/content";
import { ArrowUpRight, ArrowRight } from "lucide-react";

interface ProjectStoriesProps {
  onOpenProject: (project: ProjectStory) => void;
}

export default function ProjectStories({ onOpenProject }: ProjectStoriesProps) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  return (
    <section
      id="work"
      className="py-24 md:py-36 px-6 md:px-12 bg-chalk border-t border-stone/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-terracotta" />
              <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
                {projectStoriesSectionContent.sectionNumber}
              </span>
            </div>
            <h2 className="font-sans text-3xl md:text-5xl font-medium tracking-tight text-ink uppercase">
              {projectStoriesSectionContent.heading}
            </h2>
          </div>
          <p className="font-sans text-xs md:text-sm text-ink/60 max-w-xs">
            {projectStoriesSectionContent.instruction}
          </p>
        </div>

        {/* Asymmetric Photographic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Project 1: NOE VALLEY (Massive Horizontal Image) */}
          {(() => {
            const p1 = PROJECT_STORIES[0];
            const isHovered = hoveredProjectId === p1.id;

            return (
              <div
                className="lg:col-span-12 group cursor-pointer"
                onMouseEnter={() => setHoveredProjectId(p1.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => onOpenProject(p1)}
              >
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xs border border-stone/70 shadow-xs bg-stone/20">
                  {/* Base Finished Image */}
                  <Image
                    src={p1.image}
                    alt={p1.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                  />

                  {/* Revealed Before Image on Hover */}
                  <Image
                    src={p1.beforeImage}
                    alt={`${p1.title} before transformation`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Tiny badge in corner */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 bg-ink/80 backdrop-blur-xs text-chalk font-mono text-[10px] tracking-widest uppercase rounded-xs">
                      {isHovered
                        ? projectStoriesSectionContent.beforeBadge
                        : projectStoriesSectionContent.afterBadge}
                    </span>
                  </div>
                </div>

                {/* Tiny Captions & View Project link */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone/30 pb-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-ink uppercase">
                      {p1.neighborhood}
                    </span>
                    <span className="font-serif italic text-base sm:text-lg text-ink/80">
                      {p1.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[11px] text-ink/50 tracking-wider">
                      {p1.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(p1);
                      }}
                      className="font-mono text-xs tracking-wider text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{projectStoriesSectionContent.viewProjectLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Project 2: BERNAL HEIGHTS (Tall Portrait Image) */}
          {(() => {
            const p2 = PROJECT_STORIES[1];
            const isHovered = hoveredProjectId === p2.id;

            return (
              <div
                className="lg:col-span-5 group cursor-pointer"
                onMouseEnter={() => setHoveredProjectId(p2.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => onOpenProject(p2)}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xs border border-stone/70 shadow-xs bg-stone/20">
                  <Image
                    src={p2.image}
                    alt={p2.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <Image
                    src={p2.beforeImage}
                    alt={`${p2.title} before transformation`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 bg-ink/80 backdrop-blur-xs text-chalk font-mono text-[10px] tracking-widest uppercase rounded-xs">
                      {isHovered
                        ? projectStoriesSectionContent.beforeBadge
                        : projectStoriesSectionContent.afterBadge}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-b border-stone/30 pb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-ink uppercase">
                      {p2.neighborhood}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(p2);
                      }}
                      className="font-mono text-xs tracking-wider text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{projectStoriesSectionContent.viewProjectLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-serif italic text-base text-ink/80">
                    {p2.title}
                  </span>
                  <span className="font-mono text-[11px] text-ink/50">
                    {p2.type}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Project 3: INNER SUNSET (Wide Interior Image) */}
          {(() => {
            const p3 = PROJECT_STORIES[2];
            const isHovered = hoveredProjectId === p3.id;

            return (
              <div
                className="lg:col-span-7 group cursor-pointer"
                onMouseEnter={() => setHoveredProjectId(p3.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={() => onOpenProject(p3)}
              >
                <div className="relative w-full aspect-[16/11] overflow-hidden rounded-xs border border-stone/70 shadow-xs bg-stone/20">
                  <Image
                    src={p3.image}
                    alt={p3.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <Image
                    src={p3.beforeImage}
                    alt={`${p3.title} before transformation`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className={`object-cover transition-opacity duration-700 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 bg-ink/80 backdrop-blur-xs text-chalk font-mono text-[10px] tracking-widest uppercase rounded-xs">
                      {isHovered
                        ? projectStoriesSectionContent.beforeBadge
                        : projectStoriesSectionContent.afterBadge}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 border-b border-stone/30 pb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans font-semibold text-xs tracking-[0.2em] text-ink uppercase">
                      {p3.neighborhood}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(p3);
                      }}
                      className="font-mono text-xs tracking-wider text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{projectStoriesSectionContent.viewProjectLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-serif italic text-base text-ink/80">
                    {p3.title}
                  </span>
                  <span className="font-mono text-[11px] text-ink/50">
                    {p3.type}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
