"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import { FIRST_TRANSFORMATION } from "@/data/content";

export default function ScrollTransformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);

  // Raw target position (0 to 100 percentage)
  const targetX = useMotionValue(50);

  // Silky smooth spring for buttery cursor tracking and graceful return
  const smoothX = useSpring(targetX, {
    stiffness: 380,
    damping: 38,
    mass: 0.6,
    restDelta: 0.001,
  });

  const [activePercent, setActivePercent] = useState(50);

  // Sync motion spring to activePercent state for clipPath and boundary line
  useEffect(() => {
    const unsubscribe = smoothX.on("change", (latest) => {
      // Clamp between 2% and 98% for clean boundary
      setActivePercent(Math.min(Math.max(latest, 2), 98));
    });
    return () => unsubscribe();
  }, [smoothX]);

  // Track scroll through the section for auto-scroll mode
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate scroll-based position (travels from 15% to 85% as you scroll down)
  const getScrollPercent = useCallback((progress: number) => {
    // Active range between 0.15 and 0.85
    const clamped = Math.max(0.15, Math.min(0.85, progress));
    const normalized = (clamped - 0.15) / 0.7; // 0 to 1
    return 15 + normalized * 70; // 15% to 85%
  }, []);

  const hasInteractedRef = useRef(false);

  // Before any user cursor interaction, scroll drives targetX
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latestProgress) => {
      if (!hasInteractedRef.current && !isHovered && !isTouchActive) {
        const scrollVal = getScrollPercent(latestProgress);
        targetX.set(scrollVal);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, isHovered, isTouchActive, getScrollPercent, targetX]);

  // Calculate percentage from pointer event
  const updatePointerPosition = (clientX: number) => {
    if (!imageBoxRef.current) return;
    const rect = imageBoxRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = (relativeX / rect.width) * 100;
    const clamped = Math.max(2, Math.min(98, percentage));
    targetX.set(clamped);
  };

  // On pointer enter: smoothly update to new cursor location
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    hasInteractedRef.current = true;
    setIsHovered(true);
    updatePointerPosition(e.clientX);
  };

  // On pointer move: slide along with the cursor super smoothly
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    hasInteractedRef.current = true;
    setIsHovered(true);
    updatePointerPosition(e.clientX);
  };

  // On pointer leave: STAY at the exact last position it was left at!
  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsTouchActive(false);
    // Deliberately do NOT change targetX; it stays exactly where it was last left
  };

  // Touch handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    hasInteractedRef.current = true;
    setIsTouchActive(true);
    if (e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsTouchActive(false);
    // Stays at the last touch position
  };

  return (
    <section
      ref={containerRef}
      id="transformation-curtain"
      className="relative py-20 md:py-32 px-6 md:px-12 bg-chalk border-t border-stone/40 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-terracotta" />
              <span className="font-mono text-xs text-terracotta tracking-[0.24em] uppercase">
                {FIRST_TRANSFORMATION.sectionNumber}
              </span>
            </div>
            <h2 className="font-sans font-medium text-2xl sm:text-4xl text-ink tracking-tight uppercase">
              {FIRST_TRANSFORMATION.sectionTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono tracking-wider text-ink/70 flex items-center gap-2 bg-stone/40 px-3.5 py-1.5 rounded-xs border border-stone/60">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>
                {isHovered || isTouchActive
                  ? FIRST_TRANSFORMATION.liveScrubLabel
                  : FIRST_TRANSFORMATION.scrollScrubLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Transformation Canvas */}
        <div
          ref={imageBoxRef}
          onPointerDown={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full aspect-[16/10] md:aspect-[21/10] overflow-hidden rounded-xs border border-stone/80 shadow-md cursor-ew-resize touch-none group"
        >
          {/* Base Layer: AFTER (Finished modern warm oak & limestone kitchen) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={FIRST_TRANSFORMATION.afterImage}
              alt={FIRST_TRANSFORMATION.afterAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* "TO THIS" label pinned in the right upper corner */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 pointer-events-none z-10">
              <div className="px-3.5 py-1.5 bg-ink/85 backdrop-blur-md text-chalk font-mono text-[11px] tracking-[0.2em] uppercase rounded-xs border border-chalk/20 shadow-xs">
                {FIRST_TRANSFORMATION.toLabel}
              </div>
            </div>
          </div>

          {/* Top Layer: BEFORE (Old dated kitchen), clipped smoothly by activePercent */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden will-change-[clip-path]"
            style={{
              clipPath: `polygon(0% 0%, ${activePercent}% 0%, ${activePercent}% 100%, 0% 100%)`,
            }}
          >
            <Image
              src={FIRST_TRANSFORMATION.beforeImage}
              alt={FIRST_TRANSFORMATION.beforeAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* "FROM THIS" label pinned in the left upper corner */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 pointer-events-none z-10">
              <div className="px-3.5 py-1.5 bg-ink/85 backdrop-blur-md text-chalk font-mono text-[11px] tracking-[0.2em] uppercase rounded-xs border border-chalk/20 shadow-xs">
                {FIRST_TRANSFORMATION.fromLabel}
              </div>
            </div>
          </div>

          {/* Vertical Traveling Boundary Line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-chalk pointer-events-none z-20 shadow-[0_0_15px_rgba(0,0,0,0.6)]"
            style={{ left: `${activePercent}%` }}
          >
            {/* Center interactive handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
              <div
                className={`w-11 h-11 rounded-full bg-ink/90 border border-chalk/80 backdrop-blur-md flex items-center justify-center text-chalk shadow-xl transition-transform duration-200 ${
                  isHovered ? "scale-115 ring-2 ring-terracotta/50" : "scale-100"
                }`}
              >
                <div className="flex items-center gap-1 font-mono text-[10px] tracking-tight">
                  <span className="text-terracotta">◀</span>
                  <span className="text-chalk font-medium">
                    {Math.round(activePercent)}%
                  </span>
                  <span className="text-terracotta">▶</span>
                </div>
              </div>
            </div>

            {/* Subtle top & bottom line markers */}
            <div className="absolute top-2 -translate-x-1/2 w-3 h-1 bg-chalk/90 rounded-full" />
            <div className="absolute bottom-2 -translate-x-1/2 w-3 h-1 bg-chalk/90 rounded-full" />
          </div>

          {/* Floating pill indicator at bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-300 opacity-90 group-hover:opacity-100">
            <span className="px-3.5 py-1 bg-ink/75 backdrop-blur-md text-chalk/90 font-mono text-[10px] tracking-[0.16em] uppercase rounded-full border border-chalk/20 shadow-sm">
              {isHovered
                ? FIRST_TRANSFORMATION.dragHelpActive
                : FIRST_TRANSFORMATION.dragHelpInactive}
            </span>
          </div>
        </div>

        {/* Editorial Statement Below Transformation */}
        <div className="mt-8 md:mt-12 text-center max-w-3xl mx-auto">
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink leading-snug">
            “{FIRST_TRANSFORMATION.caption}”
          </p>
          <p className="mt-3 font-sans text-xs md:text-sm text-ink/70 tracking-wide max-w-xl mx-auto">
            {FIRST_TRANSFORMATION.subCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
