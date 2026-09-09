"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wine } from "lucide-react";
import { MenuItem, menuContent } from "@/data/content";

export type { MenuItem };
export const SIGNATURE_ITEMS: readonly MenuItem[] = menuContent.signatureDishes;

interface InteractiveMenuProps {
  onOpenFullMenu: () => void;
}

export default function InteractiveMenu({ onOpenFullMenu }: InteractiveMenuProps) {
  const [activeDishId, setActiveDishId] = useState<string>(SIGNATURE_ITEMS[2].id); // Octopus by default

  const activeDish =
    SIGNATURE_ITEMS.find((item) => item.id === activeDishId) || SIGNATURE_ITEMS[2];

  return (
    <section id="menu-section" className="py-20 md:py-28 bg-[#FAF6EE] border-b border-[#DDD1BB] paper-grain relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#DDD1BB]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#687052] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#687052]" />
              <span>{menuContent.sectionTag}</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#20201D] tracking-tight leading-tight">
              {menuContent.title}
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#68655E] mt-2">
              {menuContent.subtitle}
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <button
              onClick={onOpenFullMenu}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#20201D] text-[#FFFDF8] hover:bg-[#C75037] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>{menuContent.fullMenuCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Menu Experience: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: The Printed Menu Sheet (7 cols) */}
          <div className="lg:col-span-7 bg-[#F2EADB] border border-[#DDD1BB] p-6 sm:p-10 shadow-sm relative">
            {/* Top header of printed menu */}
            <div className="flex items-center justify-between border-b border-dashed border-[#DDD1BB] pb-4 mb-6">
              <span className="font-serif text-sm uppercase tracking-widest text-[#68655E]">
                {menuContent.sheetHeaderBrand}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#9B978F]">
                {menuContent.sheetHeaderEdition}
              </span>
            </div>

            {/* List of Dishes */}
            <div className="divide-y divide-[#DDD1BB]/70">
              {SIGNATURE_ITEMS.map((dish) => {
                const isSelected = dish.id === activeDishId;
                return (
                  <div
                    key={dish.id}
                    onMouseEnter={() => setActiveDishId(dish.id)}
                    onClick={() => setActiveDishId(dish.id)}
                    className={`group py-5 px-3 -mx-3 transition-all cursor-pointer rounded-xs ${
                      isSelected
                        ? "bg-[#FAF6EE] shadow-2xs border-l-4 border-[#C75037]"
                        : "hover:bg-[#FAF6EE]/60 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#687052]">
                            {dish.category}
                          </span>
                          {dish.tag && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#C75037]/10 text-[#C75037] rounded-xs font-medium">
                              {dish.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#20201D] group-hover:text-[#C75037] transition-colors leading-tight">
                          {dish.name}
                        </h3>
                        <span className="block font-serif italic text-sm text-[#68655E] mb-2">
                          {dish.italianName}
                        </span>

                        <p className="text-xs sm:text-sm text-[#68655E] font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {dish.description}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="font-serif text-xl font-bold text-[#20201D] group-hover:text-[#C75037]">
                          {dish.price}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider mt-2 transition-opacity ${
                            isSelected ? "text-[#C75037] opacity-100 font-semibold" : "opacity-0 group-hover:opacity-100 text-[#9B978F]"
                          }`}
                        >
                          {isSelected ? "● Viewing" : "Inspect →"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Printed Menu Footer note */}
            <div className="mt-8 pt-6 border-t border-dashed border-[#DDD1BB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68655E]">
              <span className="font-hand text-lg text-[#687052]">
                {menuContent.sheetFooterNote}
              </span>
              <button
                onClick={onOpenFullMenu}
                className="mt-2 sm:mt-0 font-medium text-[#C75037] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{menuContent.sheetFooterCta}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Photo Slide-In Inspection Panel (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#F2EADB] border border-[#DDD1BB] p-4 sm:p-6 shadow-md relative overflow-hidden">
              {/* Corner decorative tag */}
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD1BB] mb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#9B978F]">
                  Dish Photography
                </span>
                <span className="font-hand text-xl text-[#C75037] rotate-[-2deg]">
                  Live Plate Preview
                </span>
              </div>

              {/* Animated Image Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDish.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-[#E5DBC7] border border-[#DDD1BB] shadow-inner">
                    <Image
                      src={activeDish.image}
                      alt={activeDish.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {activeDish.tag && (
                      <div className="absolute top-3 left-3 bg-[#FAF6EE]/95 border border-[#DDD1BB] px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#C75037] shadow-xs">
                        {activeDish.tag}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FAF6EE] p-5 border border-[#DDD1BB]">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-serif text-2xl font-bold text-[#20201D]">
                        {activeDish.name}
                      </h4>
                      <span className="font-serif text-2xl font-bold text-[#C75037]">
                        {activeDish.price}
                      </span>
                    </div>

                    <span className="block font-serif italic text-sm text-[#687052] mb-3">
                      {activeDish.italianName}
                    </span>

                    <p className="text-sm text-[#68655E] leading-relaxed mb-4">
                      {activeDish.description}
                    </p>

                    <div className="pt-3 border-t border-dashed border-[#DDD1BB] flex items-center gap-2 text-xs font-medium text-[#20201D]">
                      <Wine className="w-4 h-4 text-[#C75037] shrink-0" />
                      <span className="italic">{activeDish.pairing}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
