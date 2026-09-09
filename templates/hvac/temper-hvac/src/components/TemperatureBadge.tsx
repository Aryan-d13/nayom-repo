"use client";

import React, { useEffect, useState } from "react";
import { useTemperature } from "@/context/TemperatureContext";
import { motion, AnimatePresence } from "framer-motion";
import { temperatureBadgeContent } from "@/data/content";

export default function TemperatureBadge() {
  const { temperature } = useTemperature();
  const [displayedTemp, setDisplayedTemp] = useState(temperature);

  // Smooth interpolation/settling of numbers
  useEffect(() => {
    if (displayedTemp === temperature) return;

    const step = displayedTemp < temperature ? 1 : -1;
    const timer = setTimeout(() => {
      setDisplayedTemp((prev) => prev + step);
    }, 45);

    return () => clearTimeout(timer);
  }, [temperature, displayedTemp]);

  // Determine delicate ambient accent color based on temperature
  const getTempColor = (t: number) => {
    if (t > 80) return "text-terracotta border-terracotta/40 bg-terracotta/10";
    if (t < 68) return "text-sky-cool border-sky/40 bg-sky/10";
    return "text-ink border-slate/20 bg-cream/90";
  };

  return (
    <aside
      aria-label={temperatureBadgeContent.ariaLabel}
      className="fixed bottom-6 right-6 z-30 select-none pointer-events-none"
    >
      <div
        className={`px-3.5 py-1.5 rounded-full border backdrop-blur-md shadow-sm flex items-center gap-2 transition-colors duration-500 ${getTempColor(
          displayedTemp
        )}`}
      >
        {/* Subtle thermal pulse dot */}
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
            displayedTemp === 72
              ? "bg-sky-cool animate-pulse"
              : displayedTemp > 75
              ? "bg-terracotta"
              : "bg-sky"
          }`}
        />

        {/* Animated temperature digits */}
        <div className="flex items-baseline font-mono">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayedTemp}
              initial={{ opacity: 0.6, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.6, y: -3 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-semibold tracking-tighter"
            >
              {displayedTemp}°
            </motion.span>
          </AnimatePresence>
          <span className="text-[9px] uppercase tracking-widest ml-1.5 opacity-60 font-sans hidden sm:inline">
            {displayedTemp === 72 ? temperatureBadgeContent.balancedLabel : temperatureBadgeContent.indoorLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}
