import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function AboutSection() {
  const siteData = getSiteData();
  const diffs = siteData.about.differentiators;

  return (
    <section id="about" className="py-20 bg-slate-950/60 border-t border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Engineering Philosophy</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Architecture & Value Proposition</h2>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
          <p className="text-lg text-slate-300 leading-relaxed">
            {siteData.about.summary || 'Building reliable, high-performance data layers, automated workers, and clean interfaces.'}
          </p>
        </div>

        {diffs && diffs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diffs.map((diff, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-sm flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{diff}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
