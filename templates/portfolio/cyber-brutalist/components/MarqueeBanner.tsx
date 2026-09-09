'use client';

import React from 'react';

interface MarqueeBannerProps {
  items?: string[];
  variant?: 'hazard' | 'checker' | 'solid-yellow' | 'dark-tech';
  speed?: 'normal' | 'fast';
  reverse?: boolean;
}

export default function MarqueeBanner({
  items = [
    '/// SYSTEM OVERRIDE',
    'HIGH PERFORMANCE ARCHITECTURE',
    'ZERO LATENCY PIPELINES',
    'RAW COMPUTE COMPUTATION',
    'AVANT-GARDE CHOREOGRAPHY',
    'SUB-MILLISECOND EXECUTION',
  ],
  variant = 'hazard',
  speed = 'normal',
  reverse = false,
}: MarqueeBannerProps) {
  // Duplicate array for seamless infinite marquee loop
  const content = [...items, ...items, ...items, ...items];

  const getVariantStyles = () => {
    switch (variant) {
      case 'hazard':
        return 'bg-[#FFE600] text-[#050505] border-y-2 border-[#050505]';
      case 'checker':
        return 'bg-[#000000] text-[#FFE600] border-y border-[rgba(255,230,0,0.3)]';
      case 'solid-yellow':
        return 'bg-[#FFE600] text-[#050505] font-black';
      case 'dark-tech':
      default:
        return 'bg-[#0C0D10] text-[#FFFFFF] border-y border-[rgba(255,255,255,0.15)]';
    }
  };

  const animClass = speed === 'fast' ? 'animate-marquee-fast' : reverse ? 'animate-marquee-reverse' : 'animate-marquee';

  return (
    <div className={`relative w-full overflow-hidden py-3 select-none ${getVariantStyles()}`}>
      <div className={`flex items-center gap-8 whitespace-nowrap will-change-transform ${animClass}`}>
        {content.map((text, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wider font-extrabold">
              {text}
            </span>
            <span className="font-mono text-xs text-[rgba(0,0,0,0.4)] dark:text-[rgba(255,255,255,0.4)]">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
