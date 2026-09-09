"use client";

import React from "react";
import Image from "next/image";
import { aboutContent } from "@/data/content";

export function About() {
  const {
    sectionTag,
    name,
    portrait,
    roles,
    curiousMotto,
    bioParagraphs,
    orbitsLabel,
    orbits,
  } = aboutContent;

  return (
    <section
      id="about"
      className="relative w-full bg-[#090A0F] py-36 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase mb-16">
          {sectionTag}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Atmospheric 35mm Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/80 bg-[#101525]">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-[#878993]">
                <span>{portrait.captionLeft}</span>
                <span>{portrait.captionRight}</span>
              </div>
            </div>
          </div>

          {/* Right: Candid Non-Corporate Bio */}
          <div className="lg:col-span-7 space-y-10 lg:pl-6">
            <div>
              <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#E7E6DF]">
                {name}
              </h2>

              <div className="mt-4 space-y-1 text-lg sm:text-xl font-mono text-[#8096C7]">
                {roles.map((r) => (
                  <p key={r}>{r}</p>
                ))}
                <p className="font-serif italic text-2xl text-[#E7E6DF] pt-1">
                  {curiousMotto}
                </p>
              </div>
            </div>

            {/* Natural Copy */}
            <div className="space-y-6 text-lg sm:text-xl text-[#E7E6DF]/85 font-light leading-relaxed">
              {bioParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Areas of Curiosity as Identity, not corporate buzzwords */}
            <div className="pt-8 border-t border-white/[0.08] space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#878993]">
                {orbitsLabel}
              </span>
              <div className="flex flex-wrap gap-3">
                {orbits.map((item) => (
                  <span
                    key={item}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider bg-[#101525] text-[#E7E6DF] border border-white/[0.06]"
                    data-thought={item.toLowerCase()}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
