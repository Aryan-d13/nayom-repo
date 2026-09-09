"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Project } from "@/data/content";

export type { Project };

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#090A0F]/90 backdrop-blur-xl"
          />

          {/* Expanded Project Viewport Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="relative z-10 w-full max-w-5xl my-auto bg-[#101525] border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.06] bg-[#090A0F]/50">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs text-[#8096C7] tracking-widest">
                  {project.num}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#878993]" />
                <span className="font-mono text-xs text-[#878993] tracking-wider">
                  CASE STUDY // {project.year}
                </span>
              </div>
              <button
                onClick={onClose}
                className="group flex items-center space-x-2 font-mono text-xs tracking-wider text-[#878993] hover:text-[#E7E6DF] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
              >
                <span>CLOSE</span>
                <span className="text-base leading-none">✕</span>
              </button>
            </div>

            {/* Modal scrollable body */}
            <div className="overflow-y-auto px-6 sm:px-12 py-8 sm:py-10 space-y-10">
              {/* Title & One Liner */}
              <div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#E7E6DF]">
                  {project.title}
                </h2>
                <p className="mt-3 text-lg sm:text-xl text-[#8096C7] font-sans font-light">
                  {project.oneLiner}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase bg-[#182035] text-[#878993] border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Large Media Display */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/[0.08] bg-[#090A0F]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Narrative Content: What I was trying to do & What I learned */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 pt-4 border-t border-white/[0.06]">
                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#8096C7]">
                    WHAT I WAS TRYING TO DO
                  </div>
                  <p className="text-base sm:text-lg text-[#E7E6DF]/85 leading-relaxed font-light">
                    {project.tryingToDo}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#8096C7]">
                    WHAT I LEARNED
                  </div>
                  <p className="text-base sm:text-lg text-[#E7E6DF]/85 leading-relaxed font-light">
                    {project.learned}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
