"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTemperature } from "@/context/TemperatureContext";
import { technicianContent } from "@/data/content";

export default function TechnicianSection() {
  const { openBooking } = useTemperature();

  return (
    <section
      id="technician"
      className="relative w-full bg-[#E9D9BE]/25 py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-b border-sand/50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Candid Real-Home Photograph */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full rounded-2xl overflow-hidden shadow-xl border border-sand/60">
              <Image
                src={technicianContent.image}
                alt={technicianContent.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div>
                <p className="text-sm font-sans font-semibold text-ink">
                  {technicianContent.name}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate">
                  {technicianContent.title}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate/70">{technicianContent.location}</span>
            </div>
          </div>

          {/* Short Honest Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta">
                {technicianContent.overline}
              </span>
              <blockquote className="font-sans text-xl sm:text-3xl text-ink font-medium leading-snug">
                &ldquo;{technicianContent.quote}&rdquo;
              </blockquote>
            </div>

            <p className="font-serif italic text-3xl sm:text-4xl text-terracotta font-normal">
              {technicianContent.punchline}
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => openBooking(technicianContent.bookingIssue)}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-terracotta transition-colors cursor-pointer"
              >
                <span>{technicianContent.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
