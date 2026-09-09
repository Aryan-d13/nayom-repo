import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function HeroSection() {
  const siteData = getSiteData();

  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          {siteData.site.niche || 'Professional Services'}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          {siteData.hero.title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          {siteData.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contact"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {siteData.hero.cta}
          </a>
          <a
            href="/services"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-lg border border-slate-200 shadow-sm transition-all"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
