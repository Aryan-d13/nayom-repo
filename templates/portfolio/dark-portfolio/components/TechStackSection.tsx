import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function TechStackSection() {
  const siteData = getSiteData();
  const stack = siteData.techStack.length > 0
    ? siteData.techStack
    : ['Python', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redis', 'Docker', 'PostgreSQL', 'FastAPI', 'Vercel'];

  return (
    <section id="stack" className="py-16 border-y border-slate-800/60 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Core Technologies</span>
          <h2 className="text-xl font-bold text-white mt-1">Production-Grade Tech Stack</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 px-4 py-2 rounded-lg text-sm font-mono transition-all"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
