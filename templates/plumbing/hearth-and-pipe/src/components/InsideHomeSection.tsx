"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { insideHomeContent } from "@/data/content";

const ROOMS = insideHomeContent.rooms;

export default function InsideHomeSection() {
  return (
    <section id="services" className="py-28 md:py-36 px-6 md:px-12 bg-[#FAFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="w-5 h-[1px] bg-[#A86F4F]" />
            <span className="text-[11px] tracking-[0.26em] uppercase font-mono text-[#242522]/60">
              {insideHomeContent.label}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-normal text-[#242522]">
            {insideHomeContent.heading}
          </h2>
        </div>

        {/* Vertical sequence of rooms */}
        <div className="space-y-28 md:space-y-40">
          {ROOMS.map((room, idx) => {
            const isImageLeft = room.layout === "image-left";

            return (
              <div
                key={room.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-7 ${
                    isImageLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0.3, filter: "blur(14px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden bg-[#E9E7E1] shadow-[0_12px_40px_rgba(36,37,34,0.05)]"
                  >
                    <Image
                      src={room.image}
                      alt={room.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[#242522]/4 mix-blend-multiply pointer-events-none" />
                  </motion.div>
                </div>

                {/* Text Column with varied architectural alignment */}
                <div
                  className={`lg:col-span-5 ${
                    isImageLeft ? "lg:order-2" : "lg:order-1"
                  } flex flex-col ${
                    room.textAlignment === "top"
                      ? "justify-start"
                      : room.textAlignment === "bottom"
                      ? "justify-end lg:pt-16"
                      : "justify-center"
                  }`}
                >
                  <div className="max-w-md">
                    {/* Small room index and title */}
                    <p className="text-[11px] tracking-[0.28em] uppercase font-mono text-[#A86F4F] mb-6">
                      0{idx + 1} — {room.name}
                    </p>

                    {/* Room items list */}
                    <div className="space-y-1 mb-8">
                      {room.items.map((item) => (
                        <h3
                          key={item}
                          className="text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium text-[#242522]"
                        >
                          {item}
                        </h3>
                      ))}
                    </div>

                    {/* Quiet statement */}
                    <p className="text-lg sm:text-xl text-[#242522]/75 font-normal leading-relaxed">
                      {room.statement}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
