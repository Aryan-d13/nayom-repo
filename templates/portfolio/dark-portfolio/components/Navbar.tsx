import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function Navbar() {
  const siteData = getSiteData();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#090d16]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold font-mono text-sm">
            {siteData.site.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-100 text-sm tracking-wide">{siteData.site.name}</span>
            {siteData.site.tagline && (
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
                / {siteData.site.niche}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-300">
          <a href="#work" className="hover:text-sky-400 transition-colors">Projects</a>
          <a href="#stack" className="hover:text-sky-400 transition-colors">Stack</a>
          <a href="#about" className="hover:text-sky-400 transition-colors">About</a>
          <a
            href="#contact"
            className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </nav>
  );
}
