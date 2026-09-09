"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { waterHeaterContent } from "@/data/content";

export default function WaterHeaterSection() {
  const { index, title, titleItalic, description, serviceList, image } =
    waterHeaterContent;

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Typography & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Large Service Index */}
            <span className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#A86F4F] mb-4 block">
              {index}
            </span>

            {/* Huge Title */}
            <h2 className="text-5xl sm:text-7xl md:text-8xl tracking-tight font-normal leading-[0.92] text-[#242522] mb-8">
              {title} <br />
              <span className="font-serif italic font-normal text-[#A86F4F]">
                {titleItalic}
              </span>
            </h2>

            {/* Small Copy */}
            <p className="text-lg sm:text-xl text-[#242522]/80 leading-relaxed max-w-lg mb-12 font-normal">
              {description}
            </p>

            {/* Focused Service Tags */}
            <div className="pt-8 border-t border-[#D4D0C7]">
              <div className="grid grid-cols-2 gap-4">
                {serviceList.map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-2 text-[12px] tracking-[0.2em] uppercase font-mono text-[#242522]/70"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A86F4F]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Photograph that slowly brightens on scroll */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0.6, filter: "brightness(0.75) contrast(0.95)" }}
              whileInView={{
                opacity: 1,
                filter: "brightness(1.02) contrast(1.0)",
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#E9E7E1] shadow-[0_12px_40px_rgba(36,37,34,0.06)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242522]/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-[#242522]/50 uppercase">
              <span>{image.captionLeft}</span>
              <span>{image.captionRight}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
