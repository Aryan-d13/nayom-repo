"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import { FINAL_TRANSFORMATION, BRAND } from "@/data/content";
import { ArrowRight, Phone } from "lucide-react";

interface FinalTransformationProps {
  onOpenInquiry: () => void;
}

export default function FinalTransformation({
  onOpenInquiry,
}: FinalTransformationProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLDivElement>(null);

  const [manualScrub, setManualScrub] = useState<number | null>(null);
  const [activePercent, setActivePercent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll tracking through this tall sticky pinned section
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Target reveal percentage (0% to 100%)
  const targetReveal = useMotionValue(0);

  // Buttery spring for smooth interpolation
  const smoothReveal = useSpring(targetReveal, {
    stiffness: 160,
    damping: 28,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Map scroll progress:
  // 0% -> 25%: Hold at 0% (Before image is 100% VISIBLE and sharp)
  // 25% -> 75%: Smoothly wipe reveal from 0% to 100% (Both images remain 100% opaque and sharp on each side)
  // 75% -> 100%: Hold at 100% (After image is 100% VISIBLE and sharp)
  useEffect(() => {
    if (manualScrub !== null) {
      targetReveal.set(manualScrub);
      return;
    }

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (isHovered) return; // Cursor interaction takes precedence when hovering canvas

      if (progress <= 0.22) {
        // Phase 1: 100% Original room visible
        targetReveal.set(0);
      } else if (progress >= 0.78) {
        // Phase 3: 100% Remodeled room visible
        targetReveal.set(100);
      } else {
        // Phase 2: Traveling reveal curtain across the middle scroll
        const normalized = (progress - 0.22) / 0.56; // 0 to 1
        targetReveal.set(normalized * 100);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, manualScrub, isHovered, targetReveal]);

  // Sync motion spring to state for clip-path rendering
  useEffect(() => {
    const unsubscribe = smoothReveal.on("change", (latest) => {
      setActivePercent(Math.max(0, Math.min(100, latest)));
    });
    return () => unsubscribe();
  }, [smoothReveal]);

  // Interactive mouse/touch scrub across the canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageCanvasRef.current) return;
    setIsHovered(true);
    const rect = imageCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    targetReveal.set(percent);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // When cursor leaves, keep position until scroll drives it again
  };

  // Determine current active stage name
  const getStageName = () => {
    if (activePercent < 15) return FINAL_TRANSFORMATION.stageNames.bones;
    if (activePercent < 45) return FINAL_TRANSFORMATION.stageNames.plaster;
    if (activePercent < 80) return FINAL_TRANSFORMATION.stageNames.joinery;
    return FINAL_TRANSFORMATION.stageNames.complete;
  };

  return (
    <section
      ref={trackRef}
      className="relative min-h-[220vh] bg-chalk border-t border-stone/50 select-none"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-8 md:top-12 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex flex-col justify-between py-6 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Center Emotional Statement Header */}
        <div className="text-center max-w-4xl mx-auto mb-4 md:mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
              {FINAL_TRANSFORMATION.sectionNumber}
            </span>
          </div>

          <h2 className="font-sans font-medium text-2xl sm:text-4xl lg:text-5xl tracking-tight text-ink uppercase leading-tight">
            {FINAL_TRANSFORMATION.promptLine1}
          </h2>

          <div className="text-2xl sm:text-4xl lg:text-5xl text-ink font-medium tracking-tight">
            <span>{FINAL_TRANSFORMATION.promptLine2} </span>
            <span className="font-serif italic text-terracotta font-normal">
              {FINAL_TRANSFORMATION.serifKeyword}
            </span>
          </div>
        </div>

        {/* The Climactic Transformation Canvas */}
        <div
          ref={imageCanvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full flex-1 min-h-[300px] max-h-[560px] rounded-xs overflow-hidden border border-stone/80 shadow-lg bg-stone/30 group cursor-ew-resize"
        >
          {/* Layer 1: The Original Unrenovated Room (100% OPAQUE & SHARP) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={FINAL_TRANSFORMATION.beforeImage}
              alt={FINAL_TRANSFORMATION.beforeAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* Before Badge: 100% opaque when in original phase */}
            <div
              className="absolute top-5 left-5 z-10 transition-opacity duration-300"
              style={{ opacity: activePercent < 90 ? 1 : 0.2 }}
            >
              <span className="px-3 py-1.5 bg-ink/85 backdrop-blur-xs text-chalk font-mono text-[10px] tracking-widest uppercase rounded-xs shadow-sm">
                {FINAL_TRANSFORMATION.beforeBadge}
              </span>
            </div>
          </div>

          {/* Layer 2: The Remodeled Room (100% OPAQUE & SHARP, revealed via traveling clip-path) */}
          <div
            className="absolute inset-0 w-full h-full will-change-[clip-path]"
            style={{
              clipPath: `polygon(0% 0%, ${activePercent}% 0%, ${activePercent}% 100%, 0% 100%)`,
            }}
          >
            <Image
              src={FINAL_TRANSFORMATION.afterImage}
              alt={FINAL_TRANSFORMATION.afterAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            {/* After Badge: 100% opaque when revealed */}
            <div
              className="absolute top-5 right-5 z-10 transition-opacity duration-300"
              style={{ opacity: activePercent > 15 ? 1 : 0.2 }}
            >
              <span className="px-3.5 py-1.5 bg-terracotta/95 backdrop-blur-xs text-chalk font-mono text-[10px] tracking-widest uppercase rounded-xs shadow-sm">
                {FINAL_TRANSFORMATION.afterBadge}
              </span>
            </div>
          </div>

          {/* Traveling Architectural Divider Line (only visible during transition 1% - 99%) */}
          {activePercent > 0.5 && activePercent < 99.5 && (
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-chalk pointer-events-none z-20 shadow-[0_0_16px_rgba(0,0,0,0.7)]"
              style={{ left: `${activePercent}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ink/90 border border-chalk/80 backdrop-blur-md flex items-center justify-center text-chalk shadow-xl">
                <span className="font-mono text-[9px] text-terracotta font-bold">
                  {Math.round(activePercent)}%
                </span>
              </div>
            </div>
          )}

          {/* Bottom Floating Status Bar inside Canvas */}
          <div className="absolute bottom-4 inset-x-4 md:bottom-5 md:inset-x-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-ink/80 backdrop-blur-md px-5 py-2.5 rounded-xs border border-chalk/15 text-chalk shadow-md">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-terracotta font-medium tracking-wider">
                {getStageName()}
              </span>

              <div className="hidden sm:flex items-center gap-1.5">
                {FINAL_TRANSFORMATION.stepButtons.map((step) => {
                  const isActive =
                    Math.abs(activePercent - step.val) < 18;

                  return (
                    <button
                      key={step.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        setManualScrub(step.val);
                        targetReveal.set(step.val);
                      }}
                      className={`px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-xs transition-colors cursor-pointer ${
                        isActive
                          ? "bg-terracotta text-chalk font-semibold"
                          : "hover:bg-chalk/15 text-chalk/70"
                      }`}
                    >
                      {step.label}
                    </button>
                  );
                })}
                {manualScrub !== null && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setManualScrub(null);
                    }}
                    className="text-[10px] text-chalk/50 hover:text-chalk underline ml-2 cursor-pointer"
                  >
                    {FINAL_TRANSFORMATION.syncScrollLabel}
                  </button>
                )}
              </div>
            </div>

            <div className="text-[11px] font-sans text-chalk/70">
              {activePercent <= 2
                ? FINAL_TRANSFORMATION.statusMessages.original
                : activePercent >= 98
                ? FINAL_TRANSFORMATION.statusMessages.complete
                : FINAL_TRANSFORMATION.statusMessages.moving}
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenInquiry}
            className="group px-8 py-3.5 bg-ink text-chalk text-xs tracking-[0.2em] uppercase font-sans flex items-center justify-center gap-3 hover:bg-terracotta transition-all duration-300 shadow-sm cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-terracotta rounded-xs"
          >
            <span>{BRAND.primaryCTA}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="px-6 py-3.5 border border-ink/30 text-ink text-xs tracking-[0.2em] uppercase font-sans flex items-center justify-center gap-2 hover:border-ink hover:bg-stone/30 transition-all duration-300 focus:outline-hidden focus:ring-1 focus:ring-terracotta rounded-xs"
          >
            <Phone className="w-3.5 h-3.5 text-terracotta" />
            <span>{BRAND.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
