"use client";

import React, { useState } from "react";
import { contactContent, personalInfo } from "@/data/content";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = personalInfo.email;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#090A0F] py-36 px-6 sm:px-12 lg:px-20 border-t border-white/[0.06]"
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Label */}
        <div className="font-mono text-xs tracking-[0.25em] text-[#8096C7] uppercase">
          {contactContent.sectionTag}
        </div>

        {/* Large Text */}
        <div>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#E7E6DF]">
            {contactContent.heading}
          </h2>
        </div>

        {/* Conversation prompts */}
        <div className="space-y-2 text-xl sm:text-2xl text-[#878993] font-light">
          {contactContent.prompts.map((prompt) => (
            <p key={prompt}>{prompt}</p>
          ))}
        </div>

        {/* Direct Links */}
        <div className="pt-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-mono text-sm sm:text-base">
            <button
              onClick={handleCopyEmail}
              className="group flex items-center space-x-2 text-[#E7E6DF] hover:text-[#8096C7] transition-colors"
              data-thought="copy email"
            >
              <span className="underline underline-offset-4">
                {copied ? contactContent.copiedText : contactContent.emailLabel}
              </span>
              <span className="text-xs text-[#878993] group-hover:text-[#8096C7]">
                ↗
              </span>
            </button>

            {personalInfo.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center space-x-2 text-[#878993] hover:text-[#E7E6DF] transition-colors"
                data-thought={link.label.toLowerCase()}
              >
                <span>{link.label}</span>
                <span className="text-xs transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Closing Note */}
        <div className="pt-12 border-t border-white/[0.06]">
          <p className="font-serif italic text-base sm:text-lg text-[#878993]">
            &ldquo;{contactContent.quote}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
