"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { finalMomentContent } from "@/data/content";

export default function FinalMoment() {
  return (
    <section
      id="final-moment"
      className="relative w-full h-[65vh] sm:h-[80vh] min-h-[500px] overflow-hidden bg-[#20231F]"
    >
      {/* Full-width unposed candid photograph */}
      <Image
        src={finalMomentContent.image}
        alt={finalMomentContent.alt}
        fill
        sizes="100vw"
        className="object-cover object-center brightness-90"
        priority
      />

      {/* Atmospheric gentle warm golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#20231F]/80 via-transparent to-[#20231F]/20" />

      {/* Corner Handwritten Moment */}
      <div className="absolute bottom-10 right-8 sm:bottom-14 sm:right-16 z-10 text-right">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-end"
        >
          <span className="font-handwritten text-3xl sm:text-4xl text-[#E5B84C] drop-shadow-md">
            {finalMomentContent.handwritten}
          </span>
          <span className="font-serif-title font-bold text-lg sm:text-xl uppercase tracking-[0.25em] text-[#FFFDF8] mt-1 drop-shadow-md">
            {finalMomentContent.brand}
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#FFFDF8]/75 uppercase mt-0.5">
            {finalMomentContent.tagline}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
