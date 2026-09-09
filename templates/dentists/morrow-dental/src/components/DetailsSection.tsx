"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { detailsContent } from "@/data/content";

export default function DetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for different items to create subtle multi-depth movement
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y5 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y6 = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const yOffsets = [y1, y2, y3, y4, y5, y6];

  return (
    <section
      ref={containerRef}
      className="py-28 sm:py-36 lg:py-48 bg-ink text-porcelain relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* Editorial Text Statement (Anchored, barely moves) */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <span className="text-[11px] font-mono tracking-widest uppercase text-porcelain/50 block mb-4">
            {detailsContent.eyebrow}
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-white uppercase mb-6"
          >
            {detailsContent.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-porcelain/80 font-light leading-relaxed"
          >
            {detailsContent.copyPrefix}
            <span className="relative inline-block text-white font-normal border-b-2 border-blush pb-0.5">
              {detailsContent.copyHighlight}
            </span>
          </motion.p>
        </div>

        {/* 6 Tasteful, Abstract Macro Beauty Sequence */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {detailsContent.items.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                style={{ y: yOffsets[idx] }}
                className="flex flex-col select-none"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-softblack border border-stone/20 group">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover object-center filter contrast-[1.05] brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Micro Index */}
                  <div className="absolute top-2 left-2 text-[9px] font-mono tracking-widest text-porcelain/60 uppercase">
                    0{idx + 1}
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono tracking-widest text-porcelain/80 uppercase truncate">
                    {item.title}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center lg:text-right">
          <span className="text-[11px] font-mono tracking-widest text-porcelain/40 uppercase">
            {detailsContent.bottomLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
