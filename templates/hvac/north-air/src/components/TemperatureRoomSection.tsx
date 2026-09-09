"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAir } from "@/context/AirContext";
import { temperatureRoomContent } from "@/data/content";

export default function TemperatureRoomSection() {
  const { setActiveTone } = useAir();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // value: -1.0 (Too Cool, bottom) to 0.0 (Just Right, center) to +1.0 (Too Warm, top)
  const [thermalState, setThermalState] = useState<number>(0.0);
  const targetThermal = useRef<number>(0.0);
  const currentThermal = useRef<number>(0.0);

  // Update navbar tone when this section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (thermalState > 0.3) setActiveTone("warm");
            else if (thermalState < -0.3) setActiveTone("cool");
            else setActiveTone("paper");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [thermalState, setActiveTone]);

  // Pointer & Touch handlers mapping vertical movement
  const handlePointerMove = useCallback((clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.height <= 0) return;

    // fraction from 0 (top) to 1 (bottom)
    const relY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    // Map: Top (0.0) -> +1.0 (Too Warm), Bottom (1.0) -> -1.0 (Too Cool)
    const val = 1.0 - relY * 2.0;
    targetThermal.current = val;
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientY);
    }
  };

  // Smooth lerp loop for thermal responsiveness
  useEffect(() => {
    let animId: number;
    const lerpLoop = () => {
      currentThermal.current += (targetThermal.current - currentThermal.current) * 0.08;
      setThermalState(Number(currentThermal.current.toFixed(3)));
      animId = requestAnimationFrame(lerpLoop);
    };
    animId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Particle simulation for rising warm air or settling cool mist
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 650);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 650;
    };
    window.addEventListener("resize", handleResize);

    interface ThermalParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
    }

    const particles: ThermalParticle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.4,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const thermal = currentThermal.current; // -1 to +1

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (thermal > 0.15) {
          // TOO WARM: Rising upward faster
          const speedMultiplier = 1 + thermal * 2.2;
          p.y -= p.speed * speedMultiplier;
          p.x += Math.sin(p.y * 0.02) * 0.5;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 178, 141, ${p.opacity * Math.min(1, thermal * 1.5)})`;
          ctx.fill();
        } else if (thermal < -0.15) {
          // TOO COOL: Settling downward slowly like heavy chilled air / condensation
          const speedMultiplier = 1 + Math.abs(thermal) * 1.6;
          p.y += p.speed * 0.6 * speedMultiplier;
          p.x += Math.cos(p.y * 0.02) * 0.3;
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(187, 217, 223, ${p.opacity * Math.min(1, Math.abs(thermal) * 1.5)})`;
          ctx.fill();
        } else {
          // JUST RIGHT: Almost perfectly still, tiny serene drift
          p.x += p.drift * 0.15;
          p.y += 0.05;
          if (p.y > height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 241, 233, 0.18)`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine current active state name and narrative
  const getEnvironmentalState = () => {
    if (thermalState > 0.28) {
      return temperatureRoomContent.states.WARM;
    }
    if (thermalState < -0.28) {
      return temperatureRoomContent.states.COOL;
    }
    return temperatureRoomContent.states.PERFECT;
  };

  const currentState = getEnvironmentalState();

  // Amber overlay opacity (top half)
  const warmOpacity = Math.max(0, thermalState * 0.72);
  // Cool blue overlay opacity (bottom half)
  const coolOpacity = Math.max(0, -thermalState * 0.72);

  return (
    <section
      id="cooling"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative min-h-[85vh] lg:min-h-[95vh] w-full bg-[#F4F1E9] py-20 px-6 sm:px-10 lg:px-16 flex flex-col justify-between select-none overflow-hidden cursor-ns-resize"
      aria-label="Interactive Room Comfort Simulation"
    >
      {/* Section Header */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#202321]/15">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#202321]/60">
            {temperatureRoomContent.overline}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#202321] mt-2 font-sans">
            {temperatureRoomContent.headline}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#202321]/70 max-w-md">
          {temperatureRoomContent.description}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 my-8 sm:my-12 w-full h-[52vh] sm:h-[60vh] rounded-none overflow-hidden border border-[#202321]/15">
        {/* Base Living Room Photo */}
        <Image
          src={temperatureRoomContent.roomImage}
          alt={temperatureRoomContent.roomImageAlt}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center filter transition-all duration-700"
          style={{
            filter: `brightness(${1 + thermalState * 0.05}) contrast(${1 - Math.abs(thermalState) * 0.06})`,
          }}
        />

        {/* Dynamic Warm Amber Atmospheric Field (Top) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-gradient-to-b from-[#E5B28D]/80 via-[#E5B28D]/45 to-transparent mix-blend-color-burn"
          style={{ opacity: warmOpacity }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-[#E5B28D]/30 mix-blend-multiply"
          style={{ opacity: warmOpacity * 0.9 }}
        />

        {/* Dynamic Cool Blue Atmospheric Field (Bottom) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-gradient-to-t from-[#BBD9DF]/85 via-[#BBD9DF]/50 to-transparent mix-blend-color"
          style={{ opacity: coolOpacity }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-[#BBD9DF]/35 mix-blend-soft-light"
          style={{ opacity: coolOpacity * 0.9 }}
        />

        {/* Condensation & Window Shimmer on Cool */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full pointer-events-none transition-opacity duration-500 bg-radial from-white/35 to-transparent"
          style={{ opacity: Math.max(0, -thermalState * 0.8) }}
        />

        {/* Air Drift Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none w-full h-full mix-blend-screen"
        />

        {/* Atmospheric Vertical Scrub Indicator (Right Rail) */}
        <div className="absolute right-6 top-8 bottom-8 hidden sm:flex flex-col items-center justify-between pointer-events-none z-20">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#202321]/60">
            WARM
          </span>
          <div className="w-[1.5px] h-full bg-[#202321]/20 relative mx-auto my-2">
            {/* Indicator bead tracking thermal value */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#202321] transition-all duration-100 shadow-sm"
              style={{
                top: `${((1 - thermalState) / 2) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#202321]/60">
            COOL
          </span>
        </div>

        {/* Big Changing State Typography Display */}
        <div className="absolute left-6 sm:left-12 bottom-8 sm:bottom-12 z-20 pointer-events-none max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-1 sm:space-y-2 bg-[#F4F1E9]/85 backdrop-blur-sm p-4 sm:p-6 border border-[#202321]/15"
            >
              <h3
                className={`text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-sans ${currentState.colorText}`}
              >
                {currentState.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#202321]/80 font-medium tracking-wide">
                {currentState.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile drag hint badge */}
        <div className="sm:hidden absolute top-4 left-4 z-20 bg-[#F4F1E9]/90 px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#202321] border border-[#202321]/10">
          {temperatureRoomContent.mobileHint}
        </div>
      </div>

      {/* Bottom Context Narrative */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs sm:text-sm text-[#202321]/70">
        {temperatureRoomContent.bullets.map((bullet) => (
          <div key={bullet.title}>
            <span className="block font-bold text-[#202321] uppercase tracking-wider mb-1">
              {bullet.title}
            </span>
            {bullet.text}
          </div>
        ))}
      </div>
    </section>
  );
}
