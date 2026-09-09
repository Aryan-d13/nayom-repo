"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { betterVisitContent } from "@/data/content";

export default function BetterVisitSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25, once: false });
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll listener inside section to compute which statement is closest to center
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // When the section is in viewport
      if (rect.top <= viewportHeight * 0.7 && rect.bottom >= viewportHeight * 0.3) {
        const totalHeight = rect.height;
        const progress = Math.min(
          Math.max((-rect.top + viewportHeight * 0.35) / totalHeight, 0),
          0.99
        );
        const index = Math.min(Math.floor(progress * 3), 2);
        setActiveIndex(index);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="approach"
      ref={containerRef}
      className="relative bg-white py-32 sm:py-44 transition-colors duration-500 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Eyebrow / Large Heading */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-ultra font-medium text-ink/50 mb-4"
          >
            {betterVisitContent.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-light text-ink tracking-tight leading-tight"
          >
            {betterVisitContent.heading}
          </motion.h2>
        </div>

        {/* Statements: Listen first. Explain clearly. Treat carefully. */}
        <div className="relative pl-8 sm:pl-14 border-l border-stone/20 my-16 sm:my-24 space-y-16 sm:space-y-24">
          {/* Moving Clay Line Indicator */}
          <div
            className="absolute left-0 w-[2.5px] bg-clay transition-all duration-500 ease-out"
            style={{
              top: `${activeIndex * 33.33}%`,
              height: "33.33%",
            }}
          />

          {betterVisitContent.statements.map((statement, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={statement.id}
                onClick={() => setActiveIndex(idx)}
                className="cursor-pointer transition-opacity duration-500 select-none group"
              >
                <h3
                  className={`text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight transition-all duration-500 ${
                    isActive
                      ? "text-ink opacity-100 translate-x-1"
                      : "text-stone opacity-35 hover:opacity-60 group-hover:translate-x-0.5"
                  }`}
                >
                  {statement.text}
                </h3>
                <p
                  className={`mt-3 text-sm sm:text-base max-w-xl transition-all duration-500 font-normal ${
                    isActive
                      ? "text-ink-muted opacity-100"
                      : "text-transparent opacity-0 h-0 overflow-hidden"
                  }`}
                >
                  {statement.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Beneath Statement */}
        <div className="mt-20 sm:mt-28 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-2xl font-light text-ink/80 leading-relaxed"
          >
            {betterVisitContent.subtext}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
