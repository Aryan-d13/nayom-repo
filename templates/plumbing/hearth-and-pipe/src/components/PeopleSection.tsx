"use client";

import Image from "next/image";
import { peopleContent } from "@/data/content";

export default function PeopleSection() {
  const { image, label, quote, quoteHighlightPrefix, quoteHighlightItalic, description, founderName, founderTitle, cta } = peopleContent;

  return (
    <section
      id="about"
      className="py-28 md:py-36 px-6 md:px-12 bg-[#E9E7E1] text-[#242522] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Candid Photograph */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#D4D0C7] shadow-[0_12px_40px_rgba(36,37,34,0.06)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#242522]/5 mix-blend-multiply pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/60">
              <span>{image.captionLeft}</span>
              <span>{image.captionRight}</span>
            </div>
          </div>

          {/* Large Quote & Perspective */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-3 mb-6">
                <span className="w-5 h-[1px] bg-[#A86F4F]" />
                <span className="text-[11px] tracking-[0.26em] uppercase font-mono text-[#242522]/60">
                  {label}
                </span>
              </div>

              {/* Editorial Quote */}
              <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight font-normal leading-[1.08] text-[#242522] mb-8 whitespace-pre-line">
                {quote}
              </blockquote>

              <p className="text-2xl sm:text-3xl md:text-4xl text-[#242522]/85 tracking-tight mb-8">
                {quoteHighlightPrefix}{" "}
                <span className="font-serif italic font-normal text-[#A86F4F]">
                  {quoteHighlightItalic}
                </span>
              </p>

              {/* Short Paragraph & Founder Signature */}
              <div className="pt-8 border-t border-[#D4D0C7] space-y-4">
                <p className="text-base sm:text-lg text-[#242522]/75 leading-relaxed font-normal max-w-lg">
                  {description}
                </p>

                <div className="pt-2">
                  <p className="text-sm font-semibold tracking-wide text-[#242522]">
                    {founderName}
                  </p>
                  <p className="text-[12px] tracking-[0.16em] uppercase font-mono text-[#242522]/55">
                    {founderTitle}
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href="#services"
                    className="inline-flex items-center space-x-2 text-[12px] tracking-[0.2em] uppercase font-semibold text-[#242522] hover:text-[#A86F4F] transition-colors group"
                  >
                    <span>{cta}</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
