"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { menuModalContent } from "@/data/content";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!isOpen) return;

    // Halt smooth scrolling on background page
    lenis?.stop();
    if (typeof window !== "undefined") {
      const win = window as unknown as { lenis?: { stop: () => void; start: () => void } };
      win.lenis?.stop?.();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // If wheel event occurs anywhere (even if cursor is outside drawer), redirect scroll to the menu drawer
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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer / Sheet */}
          <motion.div
            ref={drawerRef}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative w-full max-w-2xl h-full bg-[#171514] text-[#E9E2D4] border-l border-[#B7AEA0]/20 p-6 sm:p-12 overflow-y-auto overscroll-contain z-10 night-grain"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#B7AEA0]/20 pb-6 mb-8">
              <div>
                <span className="text-[11px] font-mono tracking-[0.24em] text-[#702F35] uppercase block mb-1">
                  {menuModalContent.badge}
                </span>
                <h3 className="text-4xl sm:text-5xl font-serif text-[#F7F2E8]">
                  {menuModalContent.title}
                </h3>
                <p className="font-mono text-xs text-[#B7AEA0] mt-1 tracking-wider uppercase">
                  {menuModalContent.hours}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#B7AEA0] hover:text-[#F7F2E8] hover:bg-[#25201f] transition-colors cursor-pointer border border-[#B7AEA0]/20"
                aria-label={menuModalContent.closeAriaLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Food Sections */}
            {menuModalContent.sections.map((section) => (
              <div key={section.title} className="mb-10">
                <h4 className="font-mono text-xs tracking-[0.24em] text-[#E6C875] uppercase border-b border-[#B7AEA0]/15 pb-2 mb-4">
                  {section.title}
                </h4>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-baseline gap-4">
                      <div>
                        <span className="font-serif text-lg text-[#F7F2E8] block">
                          {item.name}
                        </span>
                        <span className="text-xs font-sans text-[#B7AEA0]">
                          {item.description}
                        </span>
                      </div>
                      <span className="font-mono text-sm text-[#F7F2E8]">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Natural Wines Highlight */}
            <div className="mb-12 bg-[#201d1c] p-6 border border-[#B7AEA0]/15">
              <div className="flex justify-between items-baseline border-b border-[#B7AEA0]/20 pb-2 mb-4">
                <h4 className="font-mono text-xs tracking-[0.24em] text-[#702F35] uppercase font-bold">
                  {menuModalContent.wineSection.title}
                </h4>
                <span className="text-[10px] font-mono text-[#B7AEA0]">
                  {menuModalContent.wineSection.measureNote}
                </span>
              </div>
              <div className="space-y-4">
                {menuModalContent.wineSection.items.map((wine, i) => (
                  <div key={i} className="flex justify-between items-baseline gap-2">
                    <div>
                      <span className="font-serif text-base text-[#F7F2E8] block">
                        {wine.name}
                      </span>
                      <span className="text-xs font-sans text-[#B7AEA0]">
                        {wine.region} · {wine.type}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[#E6C875] text-right whitespace-nowrap">
                      <span>{wine.glass}</span> / <span>{wine.bottle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footnote */}
            <div className="text-center font-mono text-[11px] text-[#B7AEA0]/60 uppercase tracking-widest pt-4 border-t border-[#B7AEA0]/10">
              {menuModalContent.footnote}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
