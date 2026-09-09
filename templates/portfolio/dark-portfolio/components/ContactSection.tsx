import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function ContactSection() {
  const siteData = getSiteData();

  return (
    <section id="contact" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <span className="text-xs font-mono uppercase tracking-widest text-sky-400">Initiate Collaboration</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
          Ready to Build Resilient Infrastructure?
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
          Available for custom data pipelines, high-throughput automation architectures, and Next.js full-stack systems.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {siteData.contact.email ? (
            <a
              href={`mailto:${siteData.contact.email}`}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all text-sm"
            >
              Email: {siteData.contact.email}
            </a>
          ) : (
            <a
              href="mailto:contact@example.com"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/20 transition-all text-sm"
            >
              Get In Touch Directly
            </a>
          )}

          {siteData.contact.location && (
            <div className="px-5 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm font-mono">
              📍 {siteData.contact.location}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
