"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rabbitHolesContent, RabbitHoleItem } from "@/data/content";

const ITEMS: readonly RabbitHoleItem[] = rabbitHolesContent.items;

export function RabbitHoles() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeItem, setActiveItem] = useState<RabbitHoleItem | null>(null);
  const [offsets, setOffsets] = useState<{ [key: string]: { x: number; y: number } }>({});

  // Mouse repulsion interaction for desktop
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newOffsets: { [key: string]: { x: number; y: number } } = {};

      ITEMS.forEach((item) => {
        const itemX = (item.defaultX / 100) * rect.width;
        const itemY = (item.defaultY / 100) * rect.height;

        const dx = itemX - mouseX;
        const dy = itemY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 170;

        if (dist < radius && dist > 0) {
          const force = (radius - dist) / radius;
          const pushX = (dx / dist) * force * 32;
          const pushY = (dy / dist) * force * 32;
          newOffsets[item.id] = { x: pushX, y: pushY };
        } else {
          newOffsets[item.id] = { x: 0, y: 0 };
        }
      });

      setOffsets(newOffsets);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      id="thinking"
      className="relative min-h-screen w-full bg-[#090A0F] py-28 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04] overflow-hidden"
    >
      {/* Heading Block */}
      <div className="max-w-4xl mb-16">
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase mb-4">
          {rabbitHolesContent.sectionTag}
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#E7E6DF] leading-[1.02]">
          {rabbitHolesContent.headingLine1} <br />
          {rabbitHolesContent.headingLine2}
        </h2>
        <p className="mt-4 font-mono text-xs text-[#878993] tracking-wide">
          {rabbitHolesContent.description}
        </p>
      </div>

      {/* Scattered Canvas Container for Desktop/Tablet */}
      <div
        ref={containerRef}
        className="relative w-full h-[680px] hidden md:block rounded-2xl bg-[#101525]/30 border border-white/[0.03] overflow-hidden"
      >
        {/* Subtle grid guidelines like graph paper */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#E7E6DF 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {ITEMS.map((item) => {
          const offset = offsets[item.id] || { x: 0, y: 0 };
          const isSelected = activeItem?.id === item.id;

          return (
            <motion.div
              key={item.id}
              style={{
                left: `${item.defaultX}%`,
                top: `${item.defaultY}%`,
              }}
              animate={{
                x: offset.x,
                y: offset.y,
                rotate: item.rotation,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="absolute z-10 cursor-pointer select-none"
              onClick={() => setActiveItem(isSelected ? null : item)}
              data-thought="inspect note"
            >
              <div
                className={`group px-4 py-2 rounded-lg backdrop-blur-md transition-all duration-300 ${
                  isSelected
                    ? "bg-[#8096C7] text-[#090A0F] shadow-lg shadow-[#8096C7]/20 border border-[#8096C7]"
                    : "bg-[#101525]/80 hover:bg-[#101525] text-[#E7E6DF] hover:text-white border border-white/[0.08] hover:border-[#8096C7]/50"
                }`}
              >
                {/* Visual pin tape marker */}
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-[#090A0F]" : "bg-[#8096C7]"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-widest uppercase ${
                      isSelected ? "text-[#090A0F]/70" : "text-[#878993]"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="font-sans text-sm sm:text-base font-medium tracking-tight whitespace-nowrap">
                  {item.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Stacked Notebook View */}
      <div className="md:hidden space-y-3">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
            className={`w-full text-left p-4 rounded-xl transition-colors border ${
              activeItem?.id === item.id
                ? "bg-[#101525] border-[#8096C7]/60"
                : "bg-[#101525]/50 border-white/[0.06]"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8096C7]">
                {item.category}
              </span>
              <span className="text-xs text-[#878993]">
                {activeItem?.id === item.id ? "−" : "+"}
              </span>
            </div>
            <div className="text-base font-medium text-[#E7E6DF] mt-1">{item.title}</div>
            {activeItem?.id === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-white/[0.06] text-sm text-[#E7E6DF]/90 font-serif italic"
              >
                &ldquo;{item.thought}&rdquo;
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Thought Modal Note for Desktop */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden md:block fixed bottom-8 right-8 z-50 max-w-md w-full p-6 rounded-2xl bg-[#101525]/95 border border-[#8096C7]/30 shadow-2xl shadow-black/80 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-[#8096C7]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#8096C7]">
                  {rabbitHolesContent.modalPrefix} {activeItem.category}
                </span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="font-mono text-xs text-[#878993] hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/[0.05]"
              >
                {rabbitHolesContent.modalClose}
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#E7E6DF] tracking-tight mb-3">
              {activeItem.title}
            </h3>

            <p className="font-serif italic text-lg sm:text-xl text-[#F2EEE4] leading-relaxed">
              &ldquo;{activeItem.thought}&rdquo;
            </p>

            <div className="mt-4 pt-3 border-t border-white/[0.05] flex justify-between items-center text-[11px] font-mono text-[#878993]">
              <span>{rabbitHolesContent.modalFooterLeft}</span>
              <span>{rabbitHolesContent.modalFooterRight}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
