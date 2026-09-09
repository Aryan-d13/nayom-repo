"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Partner, FIRM_INFO, partnerModalContent } from "@/data/content";

interface PartnerModalProps {
  partner: Partner | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export function PartnerModal({
  partner,
  onClose,
  onOpenContact,
}: PartnerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && partner) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [partner, onClose]);

  return (
    <AnimatePresence>
      {partner && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#171817]/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="partner-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto bg-[#FCFBF7] text-[#171817] w-full max-w-2xl border border-[#D8D4CA] shadow-2xl overflow-hidden"
            >
              {/* Header Bar */}
              <div className="bg-[#F1EEE7] border-b border-[#171817]/10 px-6 py-4 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#555650]">
                <span>{partnerModalContent.docketProfilePrefix} {partner.name}</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded hover:bg-[#171817]/10 text-[#555650] hover:text-[#171817] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#D8D4CA]">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="mt-3 font-mono text-[10px] tracking-wider text-[#555650] uppercase">
                    {partnerModalContent.chambersPrefix} {FIRM_INFO.address.split(",")[0]}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h3
                      id="partner-title"
                      className="font-serif text-3xl font-medium tracking-tight text-[#171817]"
                    >
                      {partner.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#9C3C35] mt-1">
                      {partner.role}
                    </p>
                  </div>

                  <blockquote className="border-l-2 border-[#9C3C35] pl-4 py-1 italic font-serif text-lg text-[#171817]/90 leading-snug">
                    &ldquo;{partner.perspective}&rdquo;
                  </blockquote>

                  <p className="text-xs md:text-sm text-[#555650] leading-relaxed">
                    {partner.approach}
                  </p>

                  <div className="pt-4 border-t border-[#171817]/10 flex flex-wrap gap-4 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenContact();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171817] text-[#FCFBF7] hover:bg-[#9C3C35] transition-colors font-mono text-[11px] uppercase tracking-wider"
                    >
                      <span>{partnerModalContent.consultButtonPrefix} {partner.name.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`tel:${FIRM_INFO.phone.replace(/[^0-9]/g, "")}`}
                      className="font-mono text-xs text-[#555650] hover:text-[#171817] underline decoration-[#171817]/30"
                    >
                      {FIRM_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
