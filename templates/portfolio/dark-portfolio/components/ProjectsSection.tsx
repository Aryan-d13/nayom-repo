import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function ProjectsSection() {
  const siteData = getSiteData();
  const services = siteData.services;

  return (
    <section id="work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Selected Work</span>
        <h2 className="text-3xl font-extrabold text-white mt-2">Systems, Pipelines & Architectures</h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
          High-performance tools, automated workers, and reliable production pipelines built to solve complex engineering challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  {item.category || 'System Engineering'}
                </span>
                <span className="text-xs text-slate-500 font-mono">0{idx + 1}</span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                {item.name}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            {item.features && item.features.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80">
                <ul className="space-y-1.5">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
