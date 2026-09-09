"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Printer } from "lucide-react";
import { fullMenuModalContent } from "@/data/content";

interface FullMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserveClick: () => void;
}

export default function FullMenuModal({
  isOpen,
  onClose,
  onReserveClick,
}: FullMenuModalProps) {
  if (!isOpen) return null;

  const col1Categories = fullMenuModalContent.categories.slice(0, 3);
  const col2Categories = fullMenuModalContent.categories.slice(3, 5);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#20201D]/75 backdrop-blur-xs"
        />

        {/* Modal Container — Designed as an authentic unfolding paper menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#F2EADB] border-2 border-[#DDD1BB] shadow-2xl overflow-y-auto custom-scrollbar z-10 p-6 sm:p-10 md:p-12 text-[#20201D]"
        >
          {/* Top Close and Action bar */}
          <div className="flex items-center justify-between border-b border-[#DDD1BB] pb-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#20201D]">
                {fullMenuModalContent.brand}
              </span>
              <span className="hidden sm:inline-block h-6 w-px bg-[#DDD1BB]" />
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#68655E]">
                {fullMenuModalContent.carteTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD1BB] hover:border-[#20201D] text-xs uppercase tracking-wider text-[#68655E] hover:text-[#20201D] transition-colors rounded-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{fullMenuModalContent.printBtn}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 border border-[#DDD1BB] hover:border-[#C75037] hover:text-[#C75037] transition-colors rounded-xs cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Subheader */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="font-serif italic text-lg sm:text-xl text-[#68655E]">
              {fullMenuModalContent.quote}
            </p>
            <p className="text-xs uppercase tracking-widest text-[#9B978F] mt-1">
              {fullMenuModalContent.addressNote}
            </p>
          </div>

          {/* Multi-Section Menu Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 border-b border-[#DDD1BB] pb-12">
            {/* Column 1: Aperitivi & Antipasti & Paste */}
            <div className="space-y-10">
              {col1Categories.map((cat) => (
                <div key={cat.title}>
                  <h3 className="font-serif text-2xl font-bold text-[#C75037] border-b border-dashed border-[#DDD1BB] pb-2 mb-4 flex items-center justify-between">
                    <span>{cat.title}</span>
                    <span className="text-xs font-sans font-normal uppercase tracking-widest text-[#68655E]">{cat.subtitle}</span>
                  </h3>
                  <div className="space-y-4">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex justify-between items-baseline">
                        <div>
                          <div className="font-serif font-bold text-lg text-[#20201D]">{item.name}</div>
                          <div className="text-xs text-[#68655E]">{item.desc}</div>
                        </div>
                        <span className="font-serif font-bold text-base text-[#20201D]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2: Secondi al Forno, Dolci, Natural Wines */}
            <div className="space-y-10">
              {col2Categories.map((cat) => (
                <div key={cat.title}>
                  <h3 className="font-serif text-2xl font-bold text-[#687052] border-b border-dashed border-[#DDD1BB] pb-2 mb-4 flex items-center justify-between">
                    <span>{cat.title}</span>
                    <span className="text-xs font-sans font-normal uppercase tracking-widest text-[#68655E]">{cat.subtitle}</span>
                  </h3>
                  <div className="space-y-4">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex justify-between items-baseline">
                        <div>
                          <div className="font-serif font-bold text-lg text-[#20201D]">{item.name}</div>
                          <div className="text-xs text-[#68655E]">{item.desc}</div>
                        </div>
                        <span className="font-serif font-bold text-base text-[#20201D]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Vini Naturali Selection */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#687052] border-b border-dashed border-[#DDD1BB] pb-2 mb-4 flex items-center justify-between">
                  <span>VINI NATURALI</span>
                  <span className="text-xs font-sans font-normal uppercase tracking-widest text-[#68655E]">Low Intervention</span>
                </h3>
                <div className="space-y-2 text-xs text-[#68655E]">
                  {fullMenuModalContent.wines.map((wine, i) => (
                    <p key={i}>{wine}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#68655E] text-center sm:text-left">
              {fullMenuModalContent.dietaryNote}
            </div>

            <button
              onClick={() => {
                onClose();
                onReserveClick();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C75037] hover:bg-[#A93E27] text-[#FFFDF8] font-semibold text-xs uppercase tracking-widest transition-colors rounded-xs shadow-md cursor-pointer shrink-0"
            >
              {fullMenuModalContent.reserveCta}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
