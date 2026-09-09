"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "@/data/content";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [animationStage, setAnimationStage] = useState(shouldReduceMotion ? 4 : 0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle canvas for atmospheric nocturnal sky / gentle star particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Subtle faint particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.15 + 0.05,
      direction: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle night sky vignette
      const gradient = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      gradient.addColorStop(0, "rgba(16, 21, 37, 0.4)");
      gradient.addColorStop(0.5, "rgba(9, 10, 15, 0.2)");
      gradient.addColorStop(1, "rgba(9, 10, 15, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 230, 223, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Traveling point animation choreography
  useEffect(() => {
    if (shouldReduceMotion) {
      setAnimationStage(4);
      return;
    }

    // Stage 1: Point begins traveling
    const t1 = setTimeout(() => setAnimationStage(1), 300);
    // Stage 2: Point stops, line 1 & header tag reveals
    const t2 = setTimeout(() => setAnimationStage(2), 1600);
    // Stage 3: Lines 2 and 3 reveal
    const t3 = setTimeout(() => setAnimationStage(3), 2200);
    // Stage 4: Serif italic and bottom status fade in
    const t4 = setTimeout(() => setAnimationStage(4), 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#090A0F]">
      {/* Night Sky / Desk Atmospheric Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60 z-0"
      />

      {/* Cinematic Traveling Dot */}
      {!shouldReduceMotion && animationStage < 2 && (
        <motion.div
          initial={{ left: "10%", top: "35%", opacity: 0 }}
          animate={
            animationStage >= 1
              ? { left: "42%", top: "35%", opacity: [0, 1, 1, 0.7] }
              : { opacity: 0 }
          }
          transition={{ duration: 1.3, ease: [0.25, 1, 0.5, 1] }}
          className="absolute z-20 w-2 h-2 rounded-full bg-[#8096C7] shadow-[0_0_12px_#8096C7]"
        />
      )}

      {/* Top Left Sparse Tag */}
      <div className="relative z-10 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: animationStage >= 2 ? 1 : 0, y: animationStage >= 2 ? 0 : -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-1 font-mono text-xs tracking-[0.22em] text-[#878993] uppercase"
          data-thought="origin"
        >
          <p className="text-[#E7E6DF] font-medium">{heroContent.sparseName}</p>
          <p className="text-[11px] text-[#878993]">{heroContent.sparseRole}</p>
        </motion.div>
      </div>

      {/* Centerpiece Enormous Statement */}
      <div className="relative z-10 my-auto py-12 max-w-5xl">
        <div className="space-y-1 sm:space-y-2 select-none">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{
                y: animationStage >= 2 ? "0%" : "110%",
                opacity: animationStage >= 2 ? 1 : 0,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.035em] text-[#E7E6DF] leading-[0.92]"
            >
              {heroContent.statementLine1}
            </motion.h1>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{
                y: animationStage >= 3 ? "0%" : "110%",
                opacity: animationStage >= 3 ? 1 : 0,
              }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.035em] text-[#E7E6DF] leading-[0.92]"
            >
              {heroContent.statementLine2}
            </motion.h1>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{
                y: animationStage >= 3 ? "0%" : "110%",
                opacity: animationStage >= 3 ? 1 : 0,
              }}
              transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.035em] text-[#8096C7] leading-[0.92]"
            >
              {heroContent.statementLine3}
            </motion.h1>
          </div>
        </div>

        {/* Serif Italic Counter-Statement */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: animationStage >= 4 ? 1 : 0,
            x: animationStage >= 4 ? 0 : -10,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="mt-6 sm:mt-8 pl-1"
          data-thought="the point"
        >
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#E7E6DF]/90 font-normal">
            {heroContent.counterStatement}
          </p>
        </motion.div>
      </div>

      {/* Bottom Status & Narrative Cue */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: animationStage >= 4 ? 1 : 0,
          y: animationStage >= 4 ? 0 : 15,
        }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-8 border-t border-white/[0.05]"
      >
        <div className="font-mono text-xs text-[#878993] tracking-wide">
          <span className="text-[#8096C7] mr-2">{heroContent.currentPrefix}</span>
          <span className="text-[#E7E6DF]/80">
            {heroContent.currentStatus}
          </span>
        </div>

        <a
          href="#rabbit-holes"
          className="group flex items-center space-x-2 font-mono text-xs tracking-widest text-[#878993] hover:text-[#E7E6DF] transition-colors"
          data-thought="dive in"
        >
          <span>{heroContent.exploreCta}</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">
            ↓
          </span>
        </a>
      </motion.div>
    </section>
  );
}
