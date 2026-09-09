"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { heroContent, businessInfo } from "@/data/content";

export default function Hero() {
  const [loadStep, setLoadStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sequential mechanical loading sequence (hard cuts, no generic fade)
  useEffect(() => {
    // Step 1: Dashboard visible immediately
    setLoadStep(1);

    // Step 2: Warning light clicks on
    const t1 = setTimeout(() => setLoadStep(2), 350);
    // Step 3: Waveform draws
    const t2 = setTimeout(() => setLoadStep(3), 700);
    // Step 4: Headline hard cut
    const t3 = setTimeout(() => setLoadStep(4), 1050);
    // Step 5: "Let's figure it out" hard cut
    const t4 = setTimeout(() => setLoadStep(5), 1400);
    // Step 6: CTA arrives last
    const t5 = setTimeout(() => setLoadStep(6), 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Track cursor for waveform interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  // Generate interactive acoustic waveform SVG path
  const generateWaveform = () => {
    const points: string[] = [];
    const width = 600;
    const height = 40;
    const midY = height / 2;
    const segments = 40;
    const dx = width / segments;

    points.push(`M 0 ${midY}`);

    const amp = 8 + mousePos.y * 14;
    const freq = 1.8 + mousePos.x * 3.5;
    const centerDistFactor = (i: number) => {
      const normalized = i / segments;
      return Math.sin(normalized * Math.PI);
    };

    for (let i = 1; i <= segments; i++) {
      const currentX = i * dx;
      const wave =
        Math.sin((i / segments) * Math.PI * 2 * freq) *
        amp *
        centerDistFactor(i) *
        (1 + (i % 3 === 0 ? 0.4 : -0.2));
      points.push(`L ${currentX.toFixed(1)} ${(midY + wave).toFixed(1)}`);
    }

    return points.join(" ");
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] lg:min-h-screen bg-asphalt text-road-white pt-24 pb-16 flex flex-col justify-between overflow-hidden border-b border-white/10"
      aria-label="Hero Introduction"
    >
      {/* Background Dashboard Photography at Night with subtle lighting */}
      <div className="absolute inset-0 z-0 select-none">
        <div className="relative w-full h-full">
          <Image
            src={heroContent.image}
            alt={heroContent.imageAlt}
            fill
            priority
            className="object-cover object-center brightness-[0.42] contrast-[1.08] filter"
            sizes="100vw"
          />
          {/* Subtle asphalt gradient vignettes for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-asphalt via-asphalt/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-asphalt/60" />
        </div>

        {/* Tactical Workshop Grid Markings */}
        <div className="absolute top-20 right-8 hidden lg:flex flex-col items-end gap-1 font-mono text-[10px] text-metal/40 uppercase tracking-widest pointer-events-none">
          <span>{heroContent.signalText}</span>
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-3xl">
          {/* Top Shop Label */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 font-mono text-xs uppercase tracking-widest text-metal mb-6 transition-all duration-100 ${
              loadStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-signal-red" />
            <span>{heroContent.shopLabel}</span>
          </div>

          {/* Hard Cut Headline Reveal */}
          <div className="space-y-3">
            <h1
              className={`font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-road-white transition-none ${
                loadStep >= 4 ? "block" : "invisible"
              }`}
            >
              {heroContent.headline}
            </h1>

            {/* Interactive Acoustic Waveform Line (Step 3) */}
            <div
              className={`py-2 transition-opacity duration-300 ${
                loadStep >= 3 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative h-10 w-full max-w-lg flex items-center">
                <svg
                  className="w-full h-10 overflow-visible"
                  viewBox="0 0 600 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={generateWaveform()}
                    fill="none"
                    stroke="#D8513F"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-[d] duration-75 ease-out"
                  />
                </svg>
                {/* Micro readout next to waveform */}
                <span className="hidden sm:inline-block absolute right-0 -bottom-1 font-mono text-[9px] uppercase tracking-widest text-metal/70">
                  {heroContent.waveformReadout}
                </span>
              </div>
            </div>

            {/* Sub-headline: Hard cut step 5 */}
            <h2
              className={`font-display text-2xl sm:text-4xl font-semibold uppercase tracking-wide text-pale-gray transition-none ${
                loadStep >= 5 ? "block" : "invisible"
              }`}
            >
              {heroContent.subHeadline}
            </h2>
          </div>

          {/* Supporting paragraph: Step 6 */}
          <p
            className={`mt-6 text-base sm:text-lg text-metal max-w-xl font-normal leading-relaxed transition-none ${
              loadStep >= 6 ? "block" : "invisible"
            }`}
          >
            {heroContent.paragraph}
          </p>

          {/* Action CTAs: Step 6 */}
          <div
            className={`mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-none ${
              loadStep >= 6 ? "flex" : "invisible"
            }`}
          >
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-signal-red hover:bg-[#c24433] text-white font-display font-bold uppercase tracking-wider text-sm transition-colors border border-signal-red active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>{heroContent.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={businessInfo.phoneRaw}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-white/5 hover:bg-white/10 text-road-white font-mono text-sm uppercase tracking-wider border border-white/15 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
            >
              <Phone className="w-4 h-4 text-metal" />
              <span>{heroContent.secondaryCta}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Footnote / Workshop Status Badge */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 text-xs font-mono text-metal">
        <div className="flex items-center gap-4">
          <span>{heroContent.footnoteLeft}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-metal/80">
          <span>{heroContent.footnoteRight}</span>
        </div>
      </div>
    </section>
  );
}
