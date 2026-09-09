"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { menuTonightContent, TONIGHT_DISHES, type DishItem } from "@/data/content";

interface MenuTonightSectionProps {
  onOpenFullMenu: () => void;
}

export default function MenuTonightSection({
  onOpenFullMenu,
}: MenuTonightSectionProps) {
  const [hoveredDish, setHoveredDish] = useState<DishItem | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  const isTouchDevice = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(pointer: coarse)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false),
    () => false
  );

  // Mouse tracking with spring physics lag
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 22, stiffness: 160, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleDishMouseEnter = (dish: DishItem) => {
    if (!isTouchDevice) {
      setHoveredDish(dish);
    }
  };

  const handleDishMouseLeave = () => {
    if (!isTouchDevice) {
      setHoveredDish(null);
    }
  };

  const toggleMobileDish = (dishId: string) => {
    setMobileExpandedId((prev) => (prev === dishId ? null : dishId));
  };

  return (
    <section
      id="tonight-menu"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#171514] text-[#E9E2D4] night-grain py-24 sm:py-32 px-4 sm:px-8 md:px-16 overflow-hidden border-t border-[#B7AEA0]/10"
    >
      {/* Subtle background ambient note */}
      <div className="absolute top-12 right-6 sm:right-12 text-[11px] font-mono uppercase tracking-[0.24em] text-[#B7AEA0]/40 text-right">
        <span>{menuTonightContent.ambientBadge.line1}</span>
        <br />
        <span className="text-[#E6C875]">{menuTonightContent.ambientBadge.line2}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Enormous Serif Header: TONIGHT */}
        <div className="mb-14 sm:mb-20 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#702F35] block mb-2">
              {menuTonightContent.eyebrow}
            </span>
            <h2 className="text-7xl sm:text-9xl md:text-[10.5rem] font-serif tracking-tight text-[#F7F2E8] leading-[0.85]">
              {menuTonightContent.heading}
            </h2>
          </motion.div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#B7AEA0]/20 pb-4 text-xs font-mono uppercase tracking-[0.18em] text-[#B7AEA0]/70">
            <span>{menuTonightContent.subStrip.left}</span>
            <span>{menuTonightContent.subStrip.right}</span>
          </div>
        </div>

        {/* The Menu Items — real handwritten/typeset layout */}
        <div className="divide-y divide-[#B7AEA0]/15 relative">
          {TONIGHT_DISHES.map((dish) => {
            const isHovered = hoveredDish?.id === dish.id;
            const isMobileOpen = mobileExpandedId === dish.id;

            return (
              <div
                key={dish.id}
                onMouseEnter={() => handleDishMouseEnter(dish)}
                onMouseLeave={handleDishMouseLeave}
                onClick={() => toggleMobileDish(dish.id)}
                className="py-6 sm:py-8 group cursor-pointer transition-colors duration-200 hover:bg-[#201d1c]/40 px-2 sm:px-4 -mx-2 sm:-mx-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  {/* Dish Name and ingredients */}
                  <div className="flex-1 pr-4">
                    <h3
                      className={`text-xl sm:text-2xl md:text-3xl font-serif tracking-wide transition-colors duration-200 ${
                        isHovered ? "text-[#E6C875]" : "text-[#F7F2E8]"
                      }`}
                    >
                      {dish.name}
                    </h3>
                    <p className="text-sm sm:text-base font-sans text-[#B7AEA0] mt-1 font-light tracking-wide">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price aligned far to the right */}
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-mono text-[#F7F2E8] tracking-widest font-normal">
                      {dish.price}
                    </span>
                  </div>
                </div>

                {/* Mobile tap-to-reveal photograph */}
                <AnimatePresence>
                  {isMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="md:hidden overflow-hidden mt-4 pt-3 border-t border-[#B7AEA0]/15"
                    >
                      <div className="relative w-full aspect-[16/10] bg-[#242120] border border-[#B7AEA0]/20 shadow-md">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-[#171514]/80 px-2 py-1 text-[10px] font-mono tracking-widest uppercase text-[#E6C875]">
                          {dish.name}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* View Full Menu CTA */}
        <div className="mt-14 sm:mt-18 pt-6 border-t border-[#B7AEA0]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onOpenFullMenu}
            className="group inline-flex items-center space-x-3 text-sm sm:text-base tracking-[0.18em] font-mono uppercase text-[#E6C875] hover:text-[#F7F2E8] transition-colors cursor-pointer"
          >
            <span>{menuTonightContent.cta.label}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </button>
          <div className="text-xs font-mono tracking-widest text-[#B7AEA0]/60 uppercase">
            {menuTonightContent.dietaryNote}
          </div>
        </div>
      </div>

      {/* Floating Cursor Photograph (Desktop Only) */}
      {!isTouchDevice && (
        <AnimatePresence>
          {hoveredDish && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 1 }}
              exit={{ opacity: 0, scale: 0.85, rotate: -2 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                left: smoothX,
                top: smoothY,
                position: "fixed",
                pointerEvents: "none",
                zIndex: 40,
                translateX: "18px",
                translateY: "-50%",
              }}
              className="hidden md:block"
            >
              <div className="w-60 h-72 bg-[#1f1c1b] p-2 border border-[#B7AEA0]/30 shadow-2xl rotate-1">
                <div className="relative w-full h-full overflow-hidden bg-[#171514]">
                  <Image
                    src={hoveredDish.image}
                    alt={hoveredDish.name}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171514]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-baseline text-[10px] font-mono tracking-widest text-[#F7F2E8] uppercase">
                    <span className="truncate">{hoveredDish.name}</span>
                    <span className="text-[#E6C875] ml-2">{hoveredDish.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
