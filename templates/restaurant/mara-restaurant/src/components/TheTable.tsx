"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Clock, MapPin, Wine } from "lucide-react";
import { theTableContent } from "@/data/content";

interface TheTableProps {
  onReserveClick: () => void;
}

const CARD_ICONS = [Clock, Wine, Users, MapPin];
const CARD_COLORS = [
  { iconBg: "bg-[#687052]/10", iconText: "text-[#687052]", subText: "text-[#687052]" },
  { iconBg: "bg-[#C75037]/10", iconText: "text-[#C75037]", subText: "text-[#C75037]" },
  { iconBg: "bg-[#687052]/10", iconText: "text-[#687052]", subText: "text-[#687052]" },
  { iconBg: "bg-[#C75037]/10", iconText: "text-[#C75037]", subText: "text-[#C75037]" },
];

export default function TheTable({ onReserveClick }: TheTableProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageBoxRef,
    offset: ["start end", "end start"],
  });

  // Parallax zoom and gentle translation
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.03, 1.08]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={containerRef}
      id="table-section"
      className="py-20 md:py-28 bg-[#FAF6EE] border-b border-[#DDD1BB] paper-grain relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#687052] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#687052]" />
            <span>{theTableContent.sectionTag}</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#20201D] tracking-tight leading-[1.05]">
            {theTableContent.title}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#68655E] mt-3 leading-relaxed">
            {theTableContent.subtitle}
          </p>
        </div>

        {/* Large Candid Table Atmosphere Image with Optical Parallax */}
        <div
          ref={imageBoxRef}
          className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-[#E5DBC7] border border-[#DDD1BB] shadow-xl mb-14"
        >
          <motion.div style={{ scale: imgScale, y: imgY }} className="relative w-full h-full">
            <Image
              src={theTableContent.image.src}
              alt={theTableContent.image.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#20201D]/70 via-[#20201D]/15 to-transparent flex items-end p-6 sm:p-10 pointer-events-none">
            <div className="text-[#FFFDF8] max-w-xl">
              <span className="font-hand text-2xl sm:text-3xl text-[#E7C85A] block rotate-[-1deg]">
                {theTableContent.image.quote}
              </span>
              <p className="font-serif text-sm sm:text-base opacity-90 mt-1">
                {theTableContent.image.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Practical Dining Information: 4 Clear Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {theTableContent.cards.map((card, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length];
            const color = CARD_COLORS[idx % CARD_COLORS.length];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.05 + idx * 0.07 }}
                className="bg-[#F2EADB] border border-[#DDD1BB] p-6 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className={`w-9 h-9 rounded-full ${color.iconBg} flex items-center justify-center ${color.iconText} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#20201D] mb-1">
                  {card.title}
                </h3>
                <p className={`text-xs uppercase tracking-wider ${color.subText} font-semibold mb-3`}>
                  {card.subtitle}
                </p>
                <p className="text-xs text-[#68655E] leading-relaxed">
                  {card.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Action banner */}
        <div className="mt-10 bg-[#FAF6EE] border border-[#DDD1BB] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-2xl font-bold text-[#20201D]">
              {theTableContent.banner.title}
            </h4>
            <p className="text-sm text-[#68655E] mt-1">
              {theTableContent.banner.text}
            </p>
          </div>
          <button
            onClick={onReserveClick}
            className="px-7 py-3.5 bg-[#C75037] hover:bg-[#A93E27] text-[#FFFDF8] text-xs font-semibold uppercase tracking-widest transition-colors rounded-xs shadow-xs cursor-pointer shrink-0"
          >
            {theTableContent.banner.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
