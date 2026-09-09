"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { writingContent, WritingPiece } from "@/data/content";

const PIECES: readonly WritingPiece[] = writingContent.pieces;

export function WritingSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<WritingPiece | null>(null);

  return (
    <section className="relative w-full bg-[#090A0F] py-36 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Header Block: Quiet, spacious */}
        <div className="space-y-6">
          <span className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase">
            {writingContent.sectionTag}
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#E7E6DF] leading-[1.08] max-w-3xl">
            {writingContent.headingLine1} <br className="hidden sm:inline" />
            {writingContent.headingLine2} <br className="hidden sm:inline" />
            {writingContent.headingLine3}
          </h2>
        </div>

        {/* Typographic Objects */}
        <div className="space-y-16 sm:space-y-24 pt-8">
          {PIECES.map((piece) => {
            const isHovered = hoveredId === piece.id;

            return (
              <div
                key={piece.id}
                onMouseEnter={() => setHoveredId(piece.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedPiece(piece)}
                className="group cursor-pointer border-b border-white/[0.06] pb-12 transition-all duration-300"
                data-thought="read excerpt"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#8096C7] tracking-widest uppercase">
                    {piece.type}
                  </span>
                  <span className="font-mono text-[11px] text-[#878993] group-hover:text-[#E7E6DF] transition-colors">
                    {piece.readingTime}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E7E6DF] group-hover:text-white transition-colors duration-300 whitespace-pre-line leading-[1.05]">
                  {piece.title}
                </h3>

                {/* Excerpt Reveal */}
                <div className="mt-6 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0.45,
                      y: isHovered ? 0 : -2,
                    }}
                    transition={{ duration: 0.25 }}
                    className="max-w-2xl"
                  >
                    <p className="font-serif italic text-lg sm:text-xl text-[#8096C7] leading-relaxed">
                      &ldquo;{piece.excerpt}&rdquo;
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Reader Drawer Modal */}
      <AnimatePresence>
        {selectedPiece && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPiece(null)}
              className="fixed inset-0 bg-[#090A0F]/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-[#101525] border border-white/[0.08] p-8 sm:p-12 rounded-2xl shadow-2xl shadow-black/80"
            >
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/[0.08]">
                <span className="font-mono text-xs text-[#8096C7] tracking-widest">
                  {selectedPiece.type}
                </span>
                <button
                  onClick={() => setSelectedPiece(null)}
                  className="font-mono text-xs text-[#878993] hover:text-[#E7E6DF] px-2 py-1 rounded"
                >
                  CLOSE ✕
                </button>
              </div>

              <h4 className="text-2xl sm:text-3xl font-bold text-[#E7E6DF] mb-6 whitespace-pre-line tracking-tight">
                {selectedPiece.title}
              </h4>

              <div className="space-y-4 font-serif text-lg sm:text-xl text-[#E7E6DF]/90 leading-relaxed">
                <p>&ldquo;{selectedPiece.excerpt}&rdquo;</p>
                <p className="text-base font-sans text-[#878993] font-light leading-normal">
                  {writingContent.readerNote}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex justify-between font-mono text-xs text-[#878993]">
                <span>{writingContent.author}</span>
                <span>{writingContent.draftsLabel}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
