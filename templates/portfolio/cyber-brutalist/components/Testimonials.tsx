'use client';

import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface TestimonialsProps {
  siteData: SiteData;
}

export default function Testimonials({ siteData }: TestimonialsProps) {
  const { testimonials } = siteData;

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-8 md:px-[4.5vw] bg-[#050505] border-b border-[rgba(255,255,255,0.15)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[rgba(255,255,255,0.15)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-[#FFE600]" />
              <span className="font-mono text-xs font-bold text-[#FFE600] uppercase tracking-widest">
                [ 04 // VERIFIED FIELD TELEMETRY ]
              </span>
            </div>
            <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.88] uppercase text-[#FFFFFF] m-0">
              CLIENT REPORTS
            </h2>
          </div>
          <span className="font-mono text-xs text-[rgba(255,255,255,0.5)] uppercase mt-4 md:mt-0">
            AUDITED CONTRACT DELIVERIES
          </span>
        </div>

        {/* 3-Column Quote Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="relative p-8 bg-[#0C0D10] border border-[rgba(255,255,255,0.15)] hover:border-[#FFE600] flex flex-col justify-between transition-colors group"
            >
              {/* Corner Tag */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] text-[#FFE600] uppercase tracking-widest font-bold">
                  REPORT 0{i + 1} //
                </span>
                <Quote className="w-6 h-6 text-[rgba(255,230,0,0.4)] group-hover:text-[#FFE600] transition-colors" />
              </div>

              {/* Quote Content */}
              <p className="font-sans text-sm sm:text-base text-[rgba(255,255,255,0.85)] leading-relaxed italic mb-8">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author Info + Verified Metric */}
              <div className="pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                  <span className="font-display font-bold text-lg text-[#FFFFFF]">
                    {item.author}
                  </span>
                </div>
                <div className="font-mono text-xs text-[rgba(255,255,255,0.5)]">
                  {item.role} {item.company && `// ${item.company}`}
                </div>

                {item.verifiedMetric && (
                  <div className="mt-3 inline-block px-2.5 py-1 bg-[rgba(255,230,0,0.1)] border border-[#FFE600] font-mono text-[10px] text-[#FFE600] font-bold uppercase">
                    METRIC: {item.verifiedMetric}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
