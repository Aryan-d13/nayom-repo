"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { ArrowRight, Phone } from "lucide-react";
import { heroContent, companyInfo } from "@/data/content";

export default function HeroSection() {
  const { setIsBookingOpen, setBookingService, setActiveTone } = useAir();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActiveTone("paper");
  }, [setActiveTone]);

  // Subtle air particle canvas simulation
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

    // Mouse coordinates for gentle organic air repulsion
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize fine dust particles illuminated by sunlight
    const numParticles = Math.min(Math.floor(window.innerWidth / 14), 100);
    interface Particle {
      x: number;
      y: number;
      baseSpeedX: number;
      baseSpeedY: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      const baseAlpha = 0.25 + Math.random() * 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseSpeedX: 0.15 + Math.random() * 0.25, // Gentle drift to the right
        baseSpeedY: (Math.random() - 0.5) * 0.15,
        vx: 0,
        vy: 0,
        size: 1.0 + Math.random() * 2.2, // Extremely fine dust mote size
        alpha: 0, // Starts still, fades in
        baseAlpha,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.008 + Math.random() * 0.012,
      });
    }

    let startTimestamp: number | null = null;

    const render = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = (now - startTimestamp) / 1000;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade in gradually over 3 seconds
        if (elapsed < 3) {
          p.alpha = Math.min(p.baseAlpha, (elapsed / 3) * p.baseAlpha);
        } else {
          p.alpha = p.baseAlpha;
        }

        // Natural sinusoidal drift
        p.wobble += p.wobbleSpeed;
        p.x += p.baseSpeedX + Math.sin(p.wobble) * 0.25 + p.vx;
        p.y += p.baseSpeedY + Math.cos(p.wobble) * 0.2 + p.vy;

        // Friction for repulsive velocity
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Subtle organic repulsion from cursor
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 0.85;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Screen wrap
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;

        // Draw particle with sunlight glimmer
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 233, ${p.alpha})`; // Paper light dust
        ctx.fill();

        // Draw faint trailing halo
        if (p.size > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 178, 141, ${p.alpha * 0.2})`; // Warm glimmer
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-end pt-28 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden bg-[#F4F1E9]"
      aria-label="Hero Section"
    >
      {/* Background Room Scene with warm soft sunlight */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={heroContent.image}
          alt={heroContent.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] filter brightness-[0.98] contrast-[0.96]"
        />
        {/* Soft environmental light grading overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1E9] via-[#F4F1E9]/65 to-transparent sm:from-[#F4F1E9]/95 sm:via-[#F4F1E9]/50 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4F1E9]/90 via-[#F4F1E9]/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Interactive Air Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none w-full h-full mix-blend-screen"
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl">
        {/* Small location / discipline label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#607F87]" />
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#202321]/75">
            {heroContent.locationLabel}
          </p>
        </motion.div>

        {/* Huge Headline Revealed Word by Word through Mask */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black uppercase tracking-tighter leading-[0.88] text-[#202321] mb-8 font-sans">
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              {heroContent.headlineWord1}
            </motion.span>
          </span>
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              {heroContent.headlineWord2}
            </motion.span>
          </span>
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[#607F87]"
            >
              {heroContent.headlineWord3}
            </motion.span>
          </span>
        </h1>

        {/* Emotionally Important Lines */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 pt-2 border-t border-[#202321]/15 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="md:col-span-7 space-y-2"
          >
            <p className="text-lg sm:text-2xl text-[#202321]/90 font-light leading-snug">
              {heroContent.serifLead}
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#202321] leading-tight">
              {heroContent.serifItalic}
            </p>
            <p className="pt-2 text-sm sm:text-base text-[#202321]/70 max-w-md font-normal leading-relaxed">
              {heroContent.bodyCopy}
            </p>
          </motion.div>

          {/* Action CTAs sliding in horizontally */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex flex-col justify-end gap-3 sm:gap-4"
          >
            <button
              onClick={() => {
                setBookingService("Full System Evaluation");
                setIsBookingOpen(true);
              }}
              className="group inline-flex items-center justify-between px-7 py-4 bg-[#202321] text-[#F4F1E9] text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[#607F87] transition-all duration-300"
            >
              <span>{heroContent.bookCta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <a
              href={companyInfo.phoneTel}
              className="inline-flex items-center gap-3 px-6 py-3 border border-[#202321]/25 text-[#202321] text-xs sm:text-sm font-medium tracking-wide hover:border-[#202321] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#607F87]" />
              <span>{heroContent.phoneCta}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-[#202321]/50">
                {heroContent.phoneSub}
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
