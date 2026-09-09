"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PARTNERS, Partner, peopleContent } from "@/data/content";
import { PartnerModal } from "./PartnerModal";

interface PeopleSectionProps {
  onOpenContact: () => void;
}

export function PeopleSection({ onOpenContact }: PeopleSectionProps) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  return (
    <section
      id="people"
      className="relative py-24 md:py-36 bg-[#FCFBF7] document-rule-b overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Tag */}
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#555650] mb-6">
          <span className="text-[#9C3C35] font-semibold">{peopleContent.sectionNumber}</span>
          <span className="text-[#171817]/25">|</span>
          <span>{peopleContent.sectionTitle}</span>
        </div>

        {/* Large black-and-white photograph of two attorneys sitting across a table */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#D8D4CA] border border-[#171817]/15 shadow-sm mb-16">
          <Image
            src={peopleContent.image.src}
            alt={peopleContent.image.alt}
            fill
            className="object-cover filter grayscale contrast-110"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-[#171817]/10 mix-blend-multiply" />

          {/* Documentary stamp in image */}
          <div className="absolute bottom-4 left-4 bg-[#FCFBF7]/90 px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase text-[#171817] border border-[#171817]/20 backdrop-blur-xs">
            {peopleContent.image.stamp}
          </div>
        </div>

        {/* Headlines and Human Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#171817] leading-[1.08] mb-6">
              {peopleContent.headline}
            </h2>
            <p className="font-serif italic text-2xl sm:text-3xl text-[#171817]/90 font-normal leading-relaxed mb-6">
              {peopleContent.quote}
            </p>
            <p className="font-sans text-base text-[#555650] leading-relaxed max-w-xl">
              {peopleContent.description}
            </p>
          </div>

          {/* Partners Listing: Elena Hale & Marcus Mercer */}
          <div className="lg:col-span-5 space-y-8 lg:pl-8 lg:border-l border-[#171817]/10">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#555650] pb-2 border-b border-[#171817]/10">
              {peopleContent.partnersHeading}
            </div>

            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="group border-b border-[#171817]/10 pb-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#171817] tracking-tight">
                      {partner.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#9C3C35] mt-1">
                      {partner.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(partner)}
                    className="font-mono text-xs uppercase tracking-widest text-[#171817] group-hover:text-[#9C3C35] inline-flex items-center gap-1.5 transition-colors pt-1"
                  >
                    <span>{peopleContent.meetButtonPrefix} {partner.name.split(" ")[0].toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <p className="mt-3 text-xs md:text-sm text-[#555650] italic font-serif leading-relaxed line-clamp-2">
                  &ldquo;{partner.perspective}&rdquo;
                </p>
              </div>
            ))}

            <div className="font-mono text-[11px] text-[#555650] pt-2">
              {peopleContent.directPartnerGuarantee}
            </div>
          </div>
        </div>
      </div>

      {/* Partner Detail Modal */}
      <PartnerModal
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
        onOpenContact={onOpenContact}
      />
    </section>
  );
}
