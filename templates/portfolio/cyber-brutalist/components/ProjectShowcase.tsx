'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface ProjectShowcaseProps {
  siteData: SiteData;
}

export default function ProjectShowcase({ siteData }: ProjectShowcaseProps) {
  const { projects } = siteData;

  const getCanvasStyles = (tone: string) => {
    switch (tone) {
      case 'teal':
        return {
          sectionBg: 'bg-[#041217]',
          border: 'border-[rgba(0,240,255,0.2)]',
          accentColor: '#00F0FF',
          cardGlow: 'hover:shadow-[0_0_50px_rgba(0,240,255,0.15)]',
          pillBg: 'bg-[rgba(0,240,255,0.15)] border-[#00F0FF] text-[#00F0FF]',
        };
      case 'mint':
        return {
          sectionBg: 'bg-[#021A11]',
          border: 'border-[rgba(0,255,136,0.2)]',
          accentColor: '#00FF88',
          cardGlow: 'hover:shadow-[0_0_50px_rgba(0,255,136,0.15)]',
          pillBg: 'bg-[rgba(0,255,136,0.15)] border-[#00FF88] text-[#00FF88]',
        };
      case 'carbon':
        return {
          sectionBg: 'bg-[#0A0B0E]',
          border: 'border-[rgba(255,255,255,0.15)]',
          accentColor: '#FFE600',
          cardGlow: 'hover:shadow-[0_0_50px_rgba(255,230,0,0.15)]',
          pillBg: 'bg-[rgba(255,230,0,0.15)] border-[#FFE600] text-[#FFE600]',
        };
      case 'black':
      default:
        return {
          sectionBg: 'bg-[#050505]',
          border: 'border-[rgba(255,255,255,0.15)]',
          accentColor: '#FFE600',
          cardGlow: 'hover:shadow-[0_0_50px_rgba(255,230,0,0.15)]',
          pillBg: 'bg-[rgba(255,230,0,0.15)] border-[#FFE600] text-[#FFE600]',
        };
    }
  };

  return (
    <section id="projects" className="relative w-full overflow-hidden">
      {/* Top Transition Bar */}
      <div className="py-12 sm:py-16 px-4 sm:px-8 md:px-[4.5vw] bg-[#050505] border-b border-[rgba(255,255,255,0.15)] flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#FFE600]" />
            <span className="font-mono text-xs font-bold text-[#FFE600] uppercase tracking-widest">
              [ 03 // ARCHITECTURAL SHOWCASE ]
            </span>
          </div>
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.88] uppercase text-[#FFFFFF] m-0">
            CASE STUDIES
          </h2>
        </div>
        <span className="font-mono text-xs sm:text-sm text-[rgba(255,255,255,0.6)] uppercase mt-4 md:mt-0">
          INDEX [ 01 — 0{projects.length} ] // PRODUCTION RUNTIMES
        </span>
      </div>

      {/* Alternating Project Case Study Sections */}
      {projects.map((project, index) => {
        const theme = getCanvasStyles(project.bgTone);

        return (
          <article
            key={project.id || index}
            className={`relative w-full py-20 sm:py-28 px-4 sm:px-8 md:px-[4.5vw] ${theme.sectionBg} border-b border-[rgba(255,255,255,0.15)] transition-colors`}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column (40% - 5 cols): Metadata + Title + Description + Tags + CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                {/* Index + Year Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.15)]">
                  <span className="font-mono text-2xl font-black" style={{ color: theme.accentColor }}>
                    0{index + 1} // 0{projects.length}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs text-[rgba(255,255,255,0.6)]">
                    <span>{project.category}</span>
                    {project.year && <span>• {project.year}</span>}
                  </div>
                </div>

                {/* Massive Condensed Title */}
                <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] uppercase tracking-tight leading-[0.92]">
                  {project.title}
                </h3>

                {/* Narrative Description */}
                <p className="font-sans text-sm sm:text-base text-[rgba(255,255,255,0.8)] leading-relaxed">
                  {project.description}
                </p>

                {/* Performance Metrics List */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="space-y-2 py-2">
                    {project.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 font-mono text-xs text-[rgba(255,255,255,0.9)]">
                        <span style={{ color: theme.accentColor }}>✦</span>
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-3 py-1 bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.2)] font-mono text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.9)] rounded-ui"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Live Protocol CTA Button */}
                <div className="pt-4">
                  <a
                    href={project.liveUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 bg-[#FFE600] text-[#050505] font-display text-lg sm:text-xl font-bold uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-all duration-150 shadow-md"
                  >
                    <span>LAUNCH REPO // DEMO</span>
                    <div className="w-8 h-8 rounded-full bg-[#050505] text-[#FFE600] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column (60% - 7 cols): Rounded Masked Media Container with Parallax & HUD Chrome */}
              <div className="lg:col-span-7">
                <div
                  className={`group relative w-full aspect-[16/10] bg-[#000000] border-2 ${theme.border} rounded-media overflow-hidden ${theme.cardGlow} transition-all duration-300`}
                >
                  {/* Tactical Corner Reticle Brackets */}
                  <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#FFE600] z-20 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#FFE600] z-20 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#FFE600] z-20 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#FFE600] z-20 pointer-events-none" />

                  {/* Top Mask HUD Bar */}
                  <div className="absolute top-0 left-0 right-0 px-6 py-3 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.1)] z-20 flex items-center justify-between font-mono text-[10px] uppercase text-[rgba(255,255,255,0.7)]">
                    <span className="flex items-center gap-1.5" style={{ color: theme.accentColor }}>
                      <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.accentColor }} />
                      SYS.NODE // {project.id}
                    </span>
                    <span>120 FPS // 4K PIPELINE</span>
                  </div>

                  {/* Project Image Mask with Hover Scale */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
                  />

                  {/* Bottom HUD Bar */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm border-t border-[rgba(255,255,255,0.1)] z-20 flex items-center justify-between font-mono text-[10px] text-[rgba(255,255,255,0.6)]">
                    <span>SECURITY: VERIFIED</span>
                    <span style={{ color: theme.accentColor }}>STATUS: PRODUCTION-DEPLOYED</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
