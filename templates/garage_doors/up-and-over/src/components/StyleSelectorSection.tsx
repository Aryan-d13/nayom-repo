"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { DOOR_STYLES, StyleItem, styleSelectorContent } from "@/data/content";

interface StyleSelectorSectionProps {
  onOpenQuote: (service?: string) => void;
}

export default function StyleSelectorSection({
  onOpenQuote,
}: StyleSelectorSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const activeStyle: StyleItem = DOOR_STYLES[selectedIndex];

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;

      // Focal point in viewport for triggering the active style
      const focalY = window.innerHeight * 0.42;
      let activeIdx = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalY && rect.bottom >= focalY) {
          activeIdx = idx;
          minDistance = -1;
        } else if (minDistance !== -1) {
          const center = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(center - focalY);
          if (dist < minDistance) {
            minDistance = dist;
            activeIdx = idx;
          }
        }
      });

      setSelectedIndex(activeIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const scrollToItem = (index: number) => {
    const target = itemRefs.current[index];
    if (!target) return;

    isManualScrolling.current = true;
    setSelectedIndex(index);

    const navOffset = 110;
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top + window.scrollY - navOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 850);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % DOOR_STYLES.length;
    scrollToItem(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + DOOR_STYLES.length) % DOOR_STYLES.length;
    scrollToItem(prevIdx);
  };

  return (
    <section
      id="doors"
      className="relative w-full bg-[#F5F1E8] text-[#202321] py-20 sm:py-28 lg:py-32 border-b border-[#D4D0C7]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Magazine Spread Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6 border-b border-[#D4D0C7] pb-8">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#A85F45] uppercase block mb-2">
              {styleSelectorContent.sectionTag}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#202321]">
              {styleSelectorContent.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#202321]/70 tracking-wider">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(DOOR_STYLES.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1 border border-[#D4D0C7] p-1 bg-[#F5F1E8]">
              <button
                onClick={handlePrev}
                aria-label="Previous door style"
                className="p-2 hover:bg-[#202321] hover:text-[#F5F1E8] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next door style"
                className="p-2 hover:bg-[#202321] hover:text-[#F5F1E8] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Sticky Scroll Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Vertically Scrollable Style Options */}
          <div className="lg:col-span-5 flex flex-col">
            {DOOR_STYLES.map((style, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={style.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={() => scrollToItem(idx)}
                  className={`py-12 sm:py-16 lg:py-24 border-b border-[#D4D0C7] last:border-b-0 transition-all duration-500 cursor-pointer ${
                    isSelected ? "opacity-100" : "opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* Top Meta Line */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-mono tracking-widest transition-colors ${
                        isSelected
                          ? "text-[#A85F45] font-semibold"
                          : "text-[#202321]/50"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div
                      className={`h-[2px] transition-all duration-500 ${
                        isSelected
                          ? "w-12 bg-[#A85F45]"
                          : "w-5 bg-[#D4D0C7]"
                      }`}
                    />
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#53645A] uppercase truncate">
                      {style.materials.split("&")[0].trim()}
                    </span>
                  </div>

                  {/* Style Heading */}
                  <h3
                    className={`font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight transition-colors mb-4 ${
                      isSelected ? "text-[#202321]" : "text-[#202321]/70"
                    }`}
                  >
                    {style.name}
                  </h3>

                  {/* Architectural Quote */}
                  <p className="font-serif text-lg sm:text-xl text-[#202321] font-light italic leading-snug mb-5">
                    &ldquo;{style.sentence}&rdquo;
                  </p>

                  {/* Materials & Details Specification */}
                  <div className="mb-6 space-y-2">
                    <p className="text-[11px] font-mono tracking-widest text-[#53645A] uppercase">
                      {style.materials}
                    </p>
                    <p className="text-xs sm:text-sm text-[#202321]/75 leading-relaxed font-sans max-w-lg">
                      {style.details}
                    </p>
                  </div>

                  {/* Request CTA Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuote(`Custom Doors - ${style.name} Style`);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202321] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45] hover:text-[#F5F1E8] transition-colors"
                    >
                      {styleSelectorContent.requestCta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Photograph Canvas */}
          <div className="order-first lg:order-last lg:col-span-7 sticky top-20 lg:top-28 z-20 self-start w-full pb-6 lg:pb-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/11] overflow-hidden bg-[#202321] shadow-2xl border border-[#D4D0C7]/80">
              {DOOR_STYLES.map((style, idx) => {
                const isCurrent = selectedIndex === idx;

                return (
                  <motion.div
                    key={style.id}
                    initial={false}
                    animate={{
                      opacity: isCurrent ? 1 : 0,
                      scale: isCurrent ? 1 : 1.04,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      zIndex: isCurrent ? 2 : 1,
                      pointerEvents: isCurrent ? "auto" : "none",
                    }}
                  >
                    <Image
                      src={style.image}
                      alt={`${style.name} garage door installed on a residential home`}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111311]/75 via-transparent to-black/20 pointer-events-none" />

                    {/* Lower editorial caption overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between text-[#F5F1E8] gap-4 pointer-events-none">
                      <div className="max-w-md bg-[#111311]/75 backdrop-blur-sm p-3.5 sm:p-4 border-l-2 border-[#A85F45]">
                        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4D0C7] mb-1">
                          Style Note / {style.name}
                        </p>
                        <p className="text-xs text-[#F5F1E8]/90 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                          {style.details}
                        </p>
                      </div>

                      <div className="hidden sm:block text-right shrink-0">
                        <span className="text-[10px] font-mono tracking-[0.2em] text-[#D4D0C7]/80 uppercase block">
                          Elevation
                        </span>
                        <span className="font-serif text-lg text-[#F5F1E8]">
                          0{idx + 1} / 0{DOOR_STYLES.length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
