"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { theWorkContent } from "@/data/content";

const NOTES = theWorkContent.notes;

export default function TheWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealedNotes, setRevealedNotes] = useState<Record<string, boolean>>({
    cut: false,
    fit: false,
    done: false,
  });
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number; time: number }[]>([]);

  // Mouse move handler for revealing notes & drawing ephemeral water trail
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // Add to ephemeral trail
    setTrailPoints((prev) => [
      ...prev.slice(-18),
      { x: e.clientX - rect.left, y: e.clientY - rect.top, time: Date.now() },
    ]);

    // Check thresholds to trigger handwritten notes
    setRevealedNotes((prev) => {
      const next = { ...prev };
      NOTES.forEach((note) => {
        if (relX >= note.triggerThreshold - 0.15) {
          next[note.id] = true;
        }
      });
      return next;
    });
  }, []);

  // Canvas drawing loop for the ephemeral fading blue cursor trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      if (trailPoints.length > 1) {
        for (let i = 1; i < trailPoints.length; i++) {
          const ptA = trailPoints[i - 1];
          const ptB = trailPoints[i];
          const age = now - ptB.time;
          const maxLife = 700; // ms

          if (age < maxLife) {
            const opacity = (1 - age / maxLife) * 0.7;
            ctx.beginPath();
            ctx.moveTo(ptA.x, ptA.y);
            ctx.lineTo(ptB.x, ptB.y);
            ctx.strokeStyle = `rgba(104, 184, 195, ${opacity})`;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [trailPoints]);

  // Adjust canvas resolution on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.offsetWidth;
        canvasRef.current.height = containerRef.current.offsetHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  return (
    <section
      id="the-work"
      className="relative py-24 sm:py-32 bg-[#F3EFE7] border-t border-[#17252A]/10 overflow-hidden selection:bg-[#DDF0EC]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Tag */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#68B8C3]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#17252A]/60">
              {theWorkContent.sectionTag}
            </span>
          </div>

          <div className="text-[11px] font-mono uppercase text-[#17252A]/40 hidden sm:block">
            {theWorkContent.hoverHint}
          </div>
        </div>

        {/* Large photograph of plumber naturally working beneath a sink */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#17252A]/15 bg-[#17252A] cursor-crosshair group"
        >
          {/* Main Photo */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
            <Image
              src={theWorkContent.image.src}
              alt={theWorkContent.image.alt}
              fill
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
            />

            {/* Subtle photographic tone wash */}
            <div className="absolute inset-0 bg-[#17252A]/15 pointer-events-none" />

            {/* Canvas for fading thin blue cursor trail */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-20"
            />

            {/* 3 HANDWRITTEN / CRAFT NOTES */}
            {NOTES.map((note) => {
              const isRevealed = revealedNotes[note.id];
              return (
                <div
                  key={note.id}
                  style={{
                    left: `${note.xPercent}%`,
                    top: `${note.yPercent}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <AnimatePresence>
                    {(isRevealed || true) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 8 }}
                        animate={{
                          opacity: isRevealed ? 1 : 0.25,
                          scale: isRevealed ? 1 : 0.85,
                          y: isRevealed ? 0 : 4,
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 24 }}
                        className={`flex flex-col items-center sm:items-start p-2.5 sm:p-3 rounded-xl backdrop-blur-md border shadow-lg transition-colors ${
                          isRevealed
                            ? "bg-[#FFFDF8]/95 border-[#68B8C3] text-[#17252A]"
                            : "bg-[#FFFDF8]/40 border-white/20 text-[#17252A]/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#68B8C3]" />
                          <span className="font-mono font-bold text-xs sm:text-sm tracking-wider uppercase">
                            {note.text}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-sans text-[#17252A]/70 mt-0.5 whitespace-nowrap">
                          {note.annotation}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Hint overlay for mobile users */}
            <div className="sm:hidden absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-[#FFFDF8]/80 backdrop-blur-sm text-[10px] font-mono text-[#17252A]/70 text-center">
              {theWorkContent.mobileSummary}
            </div>
          </div>
        </div>

        {/* Below the photograph: Restrained Copy */}
        <div className="mt-12 sm:mt-16 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#17252A] uppercase">
            {theWorkContent.heading}
          </h3>
          <p className="text-base sm:text-lg text-[#17252A]/75 font-normal">
            {theWorkContent.subheading}
          </p>
        </div>
      </div>
    </section>
  );
}
