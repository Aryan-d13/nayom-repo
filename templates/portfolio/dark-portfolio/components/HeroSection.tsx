import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function HeroSection() {
  const siteData = getSiteData();

  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-grid-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AVAILABLE FOR SELECTIVE PROJECTS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          {siteData.hero.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          {siteData.hero.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={siteData.hero.ctaLink || '#work'}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-7 py-3 rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center gap-2"
          >
            <span>{siteData.hero.cta || 'View Projects'}</span>
            <span>→</span>
          </a>
          <a
            href="#contact"
            className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold px-7 py-3 rounded-xl border border-slate-700 transition-all"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
