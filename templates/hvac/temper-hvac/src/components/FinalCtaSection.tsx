"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTemperature } from "@/context/TemperatureContext";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import { finalCtaContent, businessInfo } from "@/data/content";

export default function FinalCtaSection() {
  const { setTemperatureState, openBooking } = useTemperature();

  // When reaching the final CTA, settle temperature permanently to 72°
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTemperatureState(finalCtaContent.settledTemp, finalCtaContent.settledState);
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById("final-cta");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [setTemperatureState]);

  return (
    <section
      id="final-cta"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-32 px-6 sm:px-8 lg:px-12 text-white"
    >
      {/* Full-Screen Evening Interior Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={finalCtaContent.image}
          alt={finalCtaContent.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Faint Cool-to-Warm gradient that passes through and settles */}
        <motion.div
          initial={{ opacity: 0.6, backgroundPosition: "0% 50%" }}
          whileInView={{ opacity: 0.3, backgroundPosition: "100% 50%" }}
          viewport={{ once: true }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-[#43545A]/40 via-[#C8DDE0]/20 to-[#E9D9BE]/30 mix-blend-overlay pointer-events-none"
        />

        {/* Cinematic Vignette for legibility and atmospheric stillness */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-sky inline-block">
            {finalCtaContent.overline}
          </span>

          <h2 className="text-4xl sm:text-7xl lg:text-8xl font-sans font-bold tracking-tight text-white leading-none">
            {finalCtaContent.headline}
          </h2>

          <p className="font-serif italic text-3xl sm:text-5xl text-sand font-light tracking-wide pt-2">
            {finalCtaContent.serifLine}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-cream/90 max-w-xl mx-auto font-light leading-relaxed"
        >
          {finalCtaContent.description}
        </motion.p>

        {/* Action Buttons & Direct Contact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
        >
          <button
            type="button"
            onClick={() => openBooking(finalCtaContent.bookingIssue)}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-terracotta text-white hover:bg-white hover:text-ink transition-all duration-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium shadow-xl hover:shadow-2xl cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>{finalCtaContent.bookCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={`tel:${businessInfo.phoneTel}`}
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-xs sm:text-sm tracking-wider font-mono cursor-pointer w-full sm:w-auto justify-center"
          >
            <Phone className="w-4 h-4 text-sky" />
            <span>{finalCtaContent.phone}</span>
          </a>
        </motion.div>

        {/* Address & Operational Radius */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-cream/70 pt-4"
        >
          <MapPin className="w-3.5 h-3.5 text-sand" />
          <span>{finalCtaContent.serviceArea}</span>
        </motion.div>
      </div>
    </section>
  );
}
