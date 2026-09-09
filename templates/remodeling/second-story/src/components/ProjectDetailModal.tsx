"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectStory, projectDetailModalContent } from "@/data/content";
import { X, SlidersHorizontal, ArrowRight, Check } from "lucide-react";

interface ProjectDetailModalProps {
  project: ProjectStory | null;
  onClose: () => void;
  onStartProject: () => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onStartProject,
}: ProjectDetailModalProps) {
  const [showComparison, setShowComparison] = useState(false);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/75 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-chalk rounded-xs border border-stone shadow-2xl overflow-hidden my-auto z-10"
        >
          {/* Header Bar */}
          <div className="p-6 md:p-8 flex items-start justify-between border-b border-stone/50 bg-stone/20">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-terracotta tracking-widest uppercase">
                  {project.neighborhood}
                </span>
                <span className="font-mono text-xs text-ink/40">•</span>
                <span className="font-mono text-xs text-ink/60">
                  {project.completedYear}
                </span>
              </div>
              <h3 className="font-sans font-medium text-2xl sm:text-3xl text-ink uppercase tracking-tight mt-1">
                {project.title}
              </h3>
              <p className="font-serif italic text-base text-ink/75 mt-0.5">
                {project.type}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-ink/60 hover:text-ink transition-colors cursor-pointer rounded-xs"
              aria-label="Close project modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Photographic Area with Interactive Comparison */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/10] bg-ink overflow-hidden">
            <Image
              src={showComparison ? project.beforeImage : project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover transition-opacity duration-500"
            />

            {/* Comparison Switcher */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-3 py-1 bg-ink/80 text-chalk text-[11px] font-mono tracking-widest uppercase rounded-xs backdrop-blur-xs">
                {showComparison ? projectDetailModalContent.beforeBadge : projectDetailModalContent.afterBadge}
              </span>

              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-3.5 py-1.5 bg-chalk text-ink text-xs font-mono uppercase tracking-wider rounded-xs shadow-md hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
                <span>{showComparison ? projectDetailModalContent.showFinishedLabel : projectDetailModalContent.showBeforeLabel}</span>
              </button>
            </div>
          </div>

          {/* Project Details / Narrative */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-8">
                <h4 className="font-mono text-xs text-terracotta tracking-widest uppercase mb-2">
                  {projectDetailModalContent.transformationHeading}
                </h4>
                <p className="font-sans text-sm md:text-base text-ink/85 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="md:col-span-4 bg-stone/30 p-4 rounded-xs border border-stone/60">
                <span className="block font-mono text-[10px] text-ink/50 tracking-wider uppercase mb-1">
                  {projectDetailModalContent.scopeHeading}
                </span>
                <p className="font-sans text-xs text-ink/90 leading-normal">
                  {project.scope}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-serif italic text-sm text-ink/70">
                {projectDetailModalContent.actionPrompt}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onStartProject();
                }}
                className="px-6 py-3 bg-ink text-chalk text-xs tracking-widest uppercase hover:bg-terracotta transition-colors flex items-center justify-center gap-2 rounded-xs cursor-pointer"
              >
                <span>{projectDetailModalContent.discussButtonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
