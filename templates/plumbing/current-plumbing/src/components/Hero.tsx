"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Phone, Droplet } from "lucide-react";
import { businessInfo, heroContent } from "@/data/content";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [dampedOffset, setDampedOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [time, setTime] = useState(0);

  // Detect touch device
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // Track cursor relative to hero container
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isTouch || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize from -1 to 1 based on center of container
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseOffset({ x: normX, y: normY });
    },
    [isTouch]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  // Perpetual subtle liquid wave oscillation & spring damping for mouse
  useEffect(() => {
    let animFrame: number;
    let t = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      t += 0.02;
      setTime(t);

      // Smooth lerp for fluid pointer reaction
      currentX += (mouseOffset.x - currentX) * 0.05;
      currentY += (mouseOffset.y - currentY) * 0.05;
      setDampedOffset({ x: currentX, y: currentY });

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [mouseOffset]);

  // Compute dynamic SVG path based on time (oscillation) and damped mouse offset
  // ViewBox: 0 0 1000 800
  const wave1 = Math.sin(time) * 12;
  const wave2 = Math.cos(time * 0.8) * 15;
  const wave3 = Math.sin(time * 1.2) * 10;

  // Pointer deflection: move mouse left => bends left (negative bendX)
  const pointerDeflection = isTouch ? 0 : dampedOffset.x * 65;

  // Key control points for the primary water path
  const p0 = { x: 420 + pointerDeflection * 0.2, y: 0 };
  const cp1 = { x: 380 + wave1 + pointerDeflection * 0.5, y: 160 };
  const cp2 = { x: 580 + wave2 + pointerDeflection * 0.8, y: 280 };
  // Connection point that emerges right from the sink faucet / kitchen sink photograph
  const pSink = { x: 680 + pointerDeflection * 0.9, y: 390 };
  const cp3 = { x: 740 + wave3 + pointerDeflection * 0.7, y: 510 };
  const cp4 = { x: 460 + wave1 + pointerDeflection * 0.5, y: 640 };
  const pEnd = { x: 510 + pointerDeflection * 0.3, y: 800 };

  const waterPathData = `M ${p0.x} ${p0.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${pSink.x} ${pSink.y} C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${pEnd.x} ${pEnd.y}`;

  // Secondary fine harmonic flow line (echo thread)
  const echoPathData = `M ${p0.x + 8} ${p0.y} C ${cp1.x + 12} ${cp1.y - 10}, ${cp2.x - 10} ${cp2.y + 15}, ${pSink.x} ${pSink.y} C ${cp3.x - 8} ${cp3.y}, ${cp4.x + 14} ${cp4.y}, ${pEnd.x + 6} ${pEnd.y}`;

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center bg-[#F3EFE7] architectural-grid overflow-hidden selection:bg-[#DDF0EC]"
    >
      {/* Subtle architectural floor-plan style background elements (abstract, not blueprint) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Abstract wall boundaries */}
          <line x1="80" y1="120" x2="1120" y2="120" stroke="#17252A" strokeWidth="1" strokeDasharray="6 8" strokeOpacity="0.15" />
          <line x1="80" y1="120" x2="80" y2="780" stroke="#17252A" strokeWidth="1" strokeDasharray="6 8" strokeOpacity="0.15" />
          <line x1="1120" y1="120" x2="1120" y2="780" stroke="#17252A" strokeWidth="1" strokeDasharray="6 8" strokeOpacity="0.15" />
          <line x1="580" y1="120" x2="580" y2="780" stroke="#17252A" strokeWidth="0.75" strokeDasharray="4 6" strokeOpacity="0.12" />
          <line x1="80" y1="460" x2="1120" y2="460" stroke="#17252A" strokeWidth="0.75" strokeDasharray="4 6" strokeOpacity="0.12" />

          {/* Minimal architectural room notations */}
          {heroContent.zones.map((zone) => (
            <text
              key={zone.label}
              x={zone.x}
              y={zone.y}
              fill="#17252A"
              fillOpacity="0.3"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="0.2em"
            >
              {zone.label}
            </text>
          ))}

          {/* Coordinate tick marks */}
          <circle cx="580" cy="120" r="3" fill="#68B8C3" fillOpacity="0.5" />
          <circle cx="580" cy="460" r="3" fill="#68B8C3" fillOpacity="0.5" />
          <circle cx="580" cy="780" r="3" fill="#68B8C3" fillOpacity="0.5" />
        </svg>
      </div>

      {/* DYNAMIC WATER PATH SVG (Begins at upper edge, winds through hero, emerges from sink photo) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle water glow halo */}
          <path
            d={waterPathData}
            stroke="#DDF0EC"
            strokeWidth="14"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />

          {/* Echo harmonic line */}
          <path
            d={echoPathData}
            stroke="#68B8C3"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
          />

          {/* Primary Water Path Line (Draws itself on entrance) */}
          <motion.path
            d={waterPathData}
            stroke="#68B8C3"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.2,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.4 },
            }}
          />

          {/* Floating water bead at the sink emergence node */}
          <circle
            cx={pSink.x}
            cy={pSink.y}
            r="5"
            fill="#68B8C3"
            className="animate-ping opacity-60"
          />
          <circle
            cx={pSink.x}
            cy={pSink.y}
            r="4"
            fill="#17252A"
          />
          <circle
            cx={pSink.x}
            cy={pSink.y}
            r="2"
            fill="#FFFDF8"
          />
        </svg>
      </div>

      {/* HERO CONTENT CONTAINER */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top-left label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#68B8C3] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#17252A]/70">
                {heroContent.badge}
              </span>
            </motion.div>

            {/* Main Headline (appears in two distinct stages) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#17252A] leading-[1.05] uppercase">
              {/* Stage 1 */}
              <motion.span
                className="block font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {heroContent.headlinePart1}
              </motion.span>
              {/* Stage 2 */}
              <motion.span
                className="block font-light text-[#17252A]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {heroContent.headlinePart2}
              </motion.span>
            </h1>

            {/* Large Serif Phrase (arrives afterward) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 sm:mt-4"
            >
              <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#68B8C3] tracking-wide">
                {heroContent.serifPhrase}
              </p>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base sm:text-lg text-[#17252A]/80 font-normal leading-relaxed"
            >
              {heroContent.description}
            </motion.p>

            {/* CTAs (arrive last) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              {/* Primary CTA */}
              <button
                onClick={onOpenBooking}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#17252A] text-[#FFFDF8] hover:bg-[#C86650] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              >
                <span>{heroContent.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#68B8C3] group-hover:text-white" />
              </button>

              {/* Secondary CTA */}
              <a
                href={`tel:${businessInfo.phoneTel}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#17252A]/20 hover:border-[#17252A] bg-[#F3EFE7]/80 text-[#17252A] text-xs sm:text-sm font-medium tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              >
                <Phone className="w-4 h-4 text-[#68B8C3]" />
                <span>{heroContent.phoneCall}</span>
              </a>
            </motion.div>

            {/* Subtle micro-hint about the living line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 2.0, duration: 1.0 }}
              className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#17252A]/50"
            >
              <Droplet className="w-3.5 h-3.5 text-[#68B8C3]" />
              <span>{heroContent.interactionHint}</span>
            </motion.div>
          </div>

          {/* Right Column: Large cropped photograph of a beautiful kitchen sink (5 columns) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, clipPath: "inset(12% 12% 12% 12% round 32px)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
              transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF8] bg-[#DDF0EC]"
            >
              <div className="relative aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] w-full">
                <Image
                  src={heroContent.image.src}
                  alt={heroContent.image.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17252A]/40 via-transparent to-transparent pointer-events-none" />

                {/* Emergence badge at bottom left of the photo */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#FFFDF8]/90 backdrop-blur-sm border border-[#17252A]/10 text-[#17252A]">
                    <span className="text-[10px] font-mono tracking-wider uppercase">
                      {heroContent.image.badge}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#68B8C3] flex items-center justify-center text-[#FFFDF8] shadow-sm">
                    <span className="text-[10px] font-bold">●</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative architectural dimension marker */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 px-3 py-1 bg-[#FFFDF8] border border-[#17252A]/15 rounded-md shadow-xs text-[10px] font-mono text-[#17252A]/60">
              {heroContent.image.dimensionMarker}
            </div>
          </div>
        </div>
      </div>

      {/* Downward transition indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <a
          href="#follow-the-water"
          aria-label="Scroll to Follow The Water section"
          className="text-[#17252A]/40 hover:text-[#68B8C3] transition-colors flex flex-col items-center gap-1"
        >
          <span className="text-[9px] uppercase tracking-widest font-mono">{heroContent.scrollHint}</span>
          <span className="w-0.5 h-6 bg-gradient-to-b from-[#68B8C3] to-transparent rounded-full animate-bounce" />
        </a>
      </div>
    </section>
  );
}
