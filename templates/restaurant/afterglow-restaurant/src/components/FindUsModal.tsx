"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Clock, Train } from "lucide-react";
import { useLenis } from "lenis/react";

import { findUsModalContent } from "@/data/content";

interface FindUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindUsModal({ isOpen, onClose }: FindUsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
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
      const isOverModal =
        modalRef.current &&
        e.target instanceof Node &&
        modalRef.current.contains(e.target);

      if (!isOverModal && modalRef.current) {
        e.preventDefault();
        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 24;
        else if (e.deltaMode === 2) delta *= window.innerHeight;
        modalRef.current.scrollTop += delta;
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card — Poster / Flyer styling */}
          <motion.div
            ref={modalRef}
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain bg-[#E9E2D4] text-[#171514] border-2 border-[#171514] p-6 sm:p-10 shadow-2xl z-10 paper-grain"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#171514] hover:bg-[#171514]/10 border border-[#171514]/20 transition-colors cursor-pointer"
              aria-label={findUsModalContent.closeAriaLabel}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b-2 border-[#171514] pb-6 mb-6">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#702F35] block mb-1">
                {findUsModalContent.badge}
              </span>
              <h3 className="text-4xl sm:text-5xl font-sans font-black tracking-tight uppercase text-[#171514]">
                {findUsModalContent.title}
              </h3>
              <p className="font-mono text-sm text-[#702F35] tracking-widest uppercase mt-1">
                {findUsModalContent.postcode}
              </p>
            </div>

            {/* Location Details */}
            <div className="space-y-6 text-sm">
              {/* Getting Here */}
              <div className="flex items-start space-x-3">
                <Train className="w-5 h-5 text-[#702F35] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs tracking-widest uppercase font-bold text-[#171514]">
                    {findUsModalContent.sections.transit.title}
                  </h4>
                  <p className="text-[#171514]/80 mt-1">
                    {findUsModalContent.sections.transit.lines[0]}
                    <br />
                    {findUsModalContent.sections.transit.lines[1]}
                    <br />
                    {findUsModalContent.sections.transit.lines[2]}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#702F35] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs tracking-widest uppercase font-bold text-[#171514]">
                    {findUsModalContent.sections.hours.title}
                  </h4>
                  <p className="text-[#171514]/80 mt-1">
                    {findUsModalContent.sections.hours.lines[0]}
                    <br />
                    {findUsModalContent.sections.hours.lines[1]}
                    <br />
                    {findUsModalContent.sections.hours.lines[2]}
                    <br />
                    {findUsModalContent.sections.hours.lines[3]}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#702F35] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-xs tracking-widest uppercase font-bold text-[#171514]">
                    {findUsModalContent.sections.contact.title}
                  </h4>
                  <p className="text-[#171514]/80 mt-1">
                    {findUsModalContent.sections.contact.phone}
                    <br />
                    {findUsModalContent.sections.contact.note}
                  </p>
                </div>
              </div>
            </div>

            {/* Map link button */}
            <div className="mt-8 pt-6 border-t border-[#171514]/20 flex justify-between items-center">
              <a
                href={findUsModalContent.mapButton.href}
                target="_blank"
                rel="noreferrer"
                className="bg-[#702F35] hover:bg-[#86373e] text-[#F7F2E8] font-mono text-xs uppercase tracking-[0.2em] px-5 py-3 transition-colors inline-block"
              >
                {findUsModalContent.mapButton.label}
              </a>
              <span className="font-mono text-[10px] text-[#171514]/50 tracking-widest uppercase">
                {findUsModalContent.areaTag}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
