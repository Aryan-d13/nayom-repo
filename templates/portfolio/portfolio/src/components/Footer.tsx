"use client";

import React from "react";
import { footerContent } from "@/data/content";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#090A0F] py-12 px-6 sm:px-12 lg:px-20 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-xs text-[#878993]">
        {/* Bottom Left: Name & Copyright */}
        <div className="flex items-center space-x-4">
          <span className="text-[#E7E6DF] tracking-wider uppercase font-medium">
            {footerContent.copyrightName}
          </span>
          <span className="text-white/[0.15]">/</span>
          <span>{footerContent.copyrightYear}</span>
        </div>

        {/* Bottom Right: STILL BECOMING → */}
        <button
          onClick={scrollToTop}
          className="group flex items-center space-x-2 text-[#878993] hover:text-[#E7E6DF] transition-colors focus:outline-none"
          data-thought="return"
        >
          <span className="tracking-[0.18em] uppercase">{footerContent.scrollTopText}</span>
          <span className="transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </button>
      </div>
    </footer>
  );
}
