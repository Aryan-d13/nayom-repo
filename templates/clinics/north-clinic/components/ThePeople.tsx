import React from "react";
import Image from "next/image";
import { thePeopleContent } from "@/data/content";

export default function ThePeople() {
  return (
    <section
      id="people"
      className="py-24 md:py-36 bg-ivory text-ink border-b border-dust overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Overline */}
        <p className="text-xs uppercase tracking-[0.25em] text-ink/50 font-sans font-medium mb-12">
          {thePeopleContent.overline}
        </p>

        {/* Large Quote Spanning the Section */}
        <div className="max-w-4xl mb-20">
          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[-0.02em] leading-[1.2] text-ink">
            {thePeopleContent.quotePart1}
            <span className="font-serif italic text-sage font-normal">
              {thePeopleContent.quoteHighlight}
            </span>{thePeopleContent.quotePart2}
          </blockquote>

          <p className="mt-8 text-base sm:text-lg text-ink/75 font-sans leading-relaxed max-w-2xl">
            {thePeopleContent.description}
          </p>
        </div>

        {/* Two Large Candid Portraits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {thePeopleContent.doctors.map((doctor) => (
            <div key={doctor.name} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-dust-light rounded-sm border border-dust/60">
                <Image
                  src={doctor.image}
                  alt={doctor.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02] filter saturate-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-light tracking-tight text-ink font-sans">
                  {doctor.name}
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-ink/60 font-sans">
                  {doctor.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
