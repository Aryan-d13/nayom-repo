"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame } from "lucide-react";
import { MotionMoment, foodInMotionContent } from "@/data/content";

export type { MotionMoment };
const MOTION_MOMENTS: readonly MotionMoment[] = foodInMotionContent.moments;

export default function FoodInMotion() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-linked horizontal marquee drift
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  // Alternate parallax speeds for the cards
  const yOdd = useTransform(scrollYProgress, [0, 1], ["15px", "-25px"]);
  const yEven = useTransform(scrollYProgress, [0, 1], ["-15px", "20px"]);

  return (
    <section
      ref={sectionRef}
      id="motion-section"
      className="py-20 md:py-28 bg-[#F2EADB] border-b border-[#DDD1BB] overflow-hidden relative paper-grain"
    >
      {/* Scroll-Driven Kinetic Typography Marquee */}
      <div className="overflow-hidden py-4 border-y border-[#DDD1BB]/80 bg-[#FAF6EE] select-none mb-16">
        <motion.div style={{ x: marqueeX }} className="flex gap-12 whitespace-nowrap will-change-transform">
          {foodInMotionContent.marqueeItems.map((word, i) => (
            <span
              key={i}
              className={`font-serif tracking-widest text-xl sm:text-2xl font-bold uppercase ${
                word === "✦" ? "text-[#C75037]" : "text-[#68655E]"
              }`}
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#687052] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#687052]" />
            <span>{foodInMotionContent.sectionTag}</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#20201D] tracking-tight leading-tight">
            {foodInMotionContent.title}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#68655E] mt-2">
            {foodInMotionContent.subtitle}
          </p>
        </div>

        {/* 5 Uneven Cinematic Craft Cards with Scroll Parallax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6">
          {MOTION_MOMENTS.map((moment, index) => {
            const cardY = index % 2 === 0 ? yEven : yOdd;

            return (
              <motion.div
                key={moment.id}
                style={{ y: cardY }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`group bg-[#FAF6EE] border border-[#DDD1BB] p-3 shadow-md hover:shadow-xl transition-all duration-300 ${moment.tilt} hover:rotate-0`}
              >
                {/* Photo */}
                <div className="relative aspect-4/5 w-full overflow-hidden bg-[#E5DBC7] border border-[#DDD1BB]">
                  <Image
                    src={moment.image}
                    alt={moment.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 220px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute top-2 left-2 bg-[#20201D]/80 text-[#FFFDF8] px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold backdrop-blur-xs">
                    {moment.tag}
                  </div>
                </div>

                {/* Caption */}
                <div className="pt-3 px-1">
                  <h3 className="font-serif text-base font-bold text-[#20201D] leading-snug group-hover:text-[#C75037] transition-colors">
                    {moment.title}
                  </h3>
                  <p className="text-[11px] text-[#68655E] mt-1 leading-normal font-sans">
                    {moment.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Handwritten Footnote */}
        <div className="mt-14 pt-8 border-t border-dashed border-[#DDD1BB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#68655E]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#C75037]" />
            <span className="font-medium text-[#20201D]">
              {foodInMotionContent.footnote}
            </span>
          </div>
          <span className="font-hand text-xl text-[#C75037] mt-3 sm:mt-0 rotate-[-1deg]">
            {foodInMotionContent.handwrittenFootnote}
          </span>
        </div>
      </div>
    </section>
  );
}
