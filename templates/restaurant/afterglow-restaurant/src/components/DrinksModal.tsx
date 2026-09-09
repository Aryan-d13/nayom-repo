"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { drinksModalContent, BAR_DRINKS } from "@/data/content";

interface DrinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrinksModal({ isOpen, onClose }: DrinksModalProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!isOpen) return;

    lenis?.stop();
    if (typeof window !== "undefined") {
      const win = window as unknown as { lenis?: { stop: () => void; start: () => void } };
      win.lenis?.stop?.();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      const isOverDrawer =
        drawerRef.current &&
        e.target instanceof Node &&
        drawerRef.current.contains(e.target);

      if (!isOverDrawer && drawerRef.current) {
        e.preventDefault();
        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 24;
        else if (e.deltaMode === 2) delta *= window.innerHeight;
        drawerRef.current.scrollTop += delta;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      lenis?.start();
      if (typeof window !== "undefined") {
        const win = window as unknown as { lenis?: { stop: () => void; start: () => void } };
        win.lenis?.start?.();
      }
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lenis, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative w-full max-w-xl h-full bg-[#702F35] text-[#F7F2E8] border-l border-[#F7F2E8]/20 p-6 sm:p-12 overflow-y-auto overscroll-contain z-10 wine-grain"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F7F2E8]/20 pb-6 mb-8">
              <div>
                <span className="text-[11px] font-mono tracking-[0.24em] text-[#E6C875] uppercase block mb-1">
                  {drinksModalContent.badge}
                </span>
                <h3 className="text-4xl sm:text-5xl font-serif text-[#F7F2E8]">
                  {drinksModalContent.title}
                </h3>
                <p className="font-mono text-xs text-[#F7F2E8]/80 mt-1 tracking-wider uppercase">
                  {drinksModalContent.hours}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#F7F2E8]/80 hover:text-[#F7F2E8] hover:bg-[#592227] transition-colors cursor-pointer border border-[#F7F2E8]/20"
                aria-label={drinksModalContent.closeAriaLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cocktail List */}
            <div className="space-y-6 mb-10">
              <h4 className="font-mono text-xs tracking-[0.24em] text-[#E6C875] uppercase border-b border-[#F7F2E8]/20 pb-2">
                {drinksModalContent.cocktailsTitle}
              </h4>
              <div className="divide-y divide-[#F7F2E8]/10">
                {BAR_DRINKS.map((drink, i) => (
                  <div key={i} className="py-4 flex justify-between items-baseline gap-4">
                    <div>
                      <h5 className="font-serif text-xl text-[#F7F2E8]">
                        {drink.name}
                      </h5>
                      <p className="font-sans text-xs text-[#F7F2E8]/75 mt-0.5">
                        {drink.ingredients}
                      </p>
                    </div>
                    <span className="font-mono text-base font-semibold text-[#E6C875]">
                      {drink.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Beers & Cider */}
            <div className="space-y-4 mb-10">
              <h4 className="font-mono text-xs tracking-[0.24em] text-[#E6C875] uppercase border-b border-[#F7F2E8]/20 pb-2">
                {drinksModalContent.beersTitle}
              </h4>
              <div className="space-y-3 font-sans text-sm">
                {drinksModalContent.beers.map((beer, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <span>{beer.name}</span>
                    <span className="font-mono text-xs text-[#E6C875]">{beer.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar philosophy */}
            <div className="p-5 bg-[#541f24] border border-[#F7F2E8]/20 mt-8">
              <p className="font-serif italic text-base sm:text-lg text-[#F7F2E8]">
                &ldquo;{drinksModalContent.philosophy}&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
