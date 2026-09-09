"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { quietFinaleContent } from "@/data/content";

export default function QuietFinale() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={containerRef} className="relative w-full bg-[#20201D] overflow-hidden border-b border-[#DDD1BB]">
      {/* Full-width atmospheric visual with parallax depth */}
      <div className="relative aspect-16/9 sm:aspect-21/9 lg:aspect-24/9 w-full min-h-[380px] sm:min-h-[460px] overflow-hidden">
        <motion.div style={{ scale: imgScale, y: imgY }} className="relative w-full h-full">
          <Image
            src={quietFinaleContent.image.src}
            alt={quietFinaleContent.image.alt}
            fill
            sizes="100vw"
            className="object-cover object-center brightness-90"
          />
        </motion.div>

        {/* Ambient Darkened Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20201D]/90 via-[#20201D]/30 to-transparent pointer-events-none" />

        {/* Corner Quiet Reveal Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-14 md:p-20 text-[#FFFDF8] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#E7C85A] font-semibold block mb-2">
              {quietFinaleContent.tag}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-none mb-3">
              {quietFinaleContent.heading}
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#FAF6EE]/90">
              {quietFinaleContent.description}
            </p>
          </motion.div>
        </div>

        {/* Bottom Corner Postal Stamp */}
        <div className="absolute top-8 right-8 hidden sm:block border-2 border-dashed border-[#FFFDF8]/40 p-3 bg-[#20201D]/50 backdrop-blur-xs text-right rotate-2">
          <span className="block font-serif text-xs font-bold text-[#FFFDF8]">{quietFinaleContent.stampBrand}</span>
          <span className="block text-[9px] uppercase tracking-widest text-[#E7C85A]">{quietFinaleContent.stampLocation}</span>
        </div>
      </div>
    </section>
  );
}
