'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface FAQSectionProps {
  siteData: SiteData;
}

export default function FAQSection({ siteData }: FAQSectionProps) {
  const { faq } = siteData;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div id="faq" className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 bg-[#FFE600]" />
        <span className="font-mono text-xs font-bold text-[#FFE600] uppercase tracking-widest">
          [ 05 // SYSTEM PROTOCOLS & FAQ ]
        </span>
      </div>

      <h3 className="font-display font-black text-3xl sm:text-4xl text-[#FFFFFF] uppercase tracking-tight mb-8">
        FREQUENTLY RESOLVED
      </h3>

      {/* Accordion Container */}
      <div className="space-y-4">
        {faq.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`border transition-colors ${
                isOpen
                  ? 'border-[#FFE600] bg-[#0C0D10]'
                  : 'border-[rgba(255,255,255,0.15)] bg-[#050505] hover:border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <button
                onClick={() => toggleIndex(index)}
                type="button"
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono text-xs text-[#FFE600] font-bold">
                    0{index + 1}
                  </span>
                  <span className="font-display text-lg sm:text-xl font-bold uppercase text-[#FFFFFF] tracking-wide">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isOpen ? 'bg-[#FFE600] text-[#050505]' : 'bg-[rgba(255,255,255,0.1)] text-[#FFFFFF]'
                  }`}
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                  <p className="font-sans text-sm sm:text-base text-[rgba(255,255,255,0.75)] leading-relaxed">
                    {item.answer}
                  </p>
                  {item.category && (
                    <div className="mt-4 inline-block font-mono text-[10px] uppercase text-[#FFE600] tracking-widest">
                      CLASSIFICATION // {item.category}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
