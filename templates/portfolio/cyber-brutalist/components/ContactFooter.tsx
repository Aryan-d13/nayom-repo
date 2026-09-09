'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Send,
  Github,
  Twitter,
  Linkedin,
  Disc as Discord,
  Send as Telegram,
  Radio,
} from 'lucide-react';
import { SiteData } from '../lib/site-data';
import FAQSection from './FAQSection';
import MarqueeBanner from './MarqueeBanner';

interface ContactFooterProps {
  siteData: SiteData;
  onOpenContact: () => void;
}

export default function ContactFooter({ siteData, onOpenContact }: ContactFooterProps) {
  const { contact, site, socialLinks } = siteData;
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const getSocialIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'discord':
        return <Discord className="w-4 h-4" />;
      case 'telegram':
        return <Telegram className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <footer id="contact" className="relative w-full bg-[#050505] text-[#FFFFFF] overflow-hidden">
      {/* Upper Hazard Marquee Ribbon */}
      <MarqueeBanner
        items={[
          '/// TRANSMISSION READY',
          'HIGH VELOCITY CONTRACTS OPEN',
          'SUB-MS EXECUTION GUARANTEED',
          'DIRECT LINK ESTABLISHED',
        ]}
        variant="hazard"
        speed="fast"
      />

      {/* Main Split Footer Section (50% FAQ / 50% Massive CTA + Contacts) */}
      <div className="py-20 sm:py-28 px-4 sm:px-8 md:px-[4.5vw] border-b border-[rgba(255,255,255,0.15)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left Column (6 cols): FAQ Accordion Module */}
          <div className="lg:col-span-6">
            <FAQSection siteData={siteData} />
          </div>

          {/* Right Column (6 cols): Massive Brutalist CTA Typography & Transmission Channels */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-10">
            <div>
              {/* Header Status Beacon */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-[#00FF88] rounded-full animate-ping" />
                <span className="font-mono text-xs font-bold text-[#00FF88] uppercase tracking-widest">
                  [ 06 // TRANSMISSION CHANNEL LIVE ]
                </span>
              </div>

              {/* Massive Outlined / Solid Brutalist CTA */}
              <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[4.2vw] leading-[0.88] uppercase tracking-tight text-[#FFFFFF] m-0 mb-6">
                <span>LET&apos;S BUILD </span>
                <span className="text-stroke-yellow block">UNFORGIVABLY</span>
                <span className="text-[#FFE600] block">FAST.</span>
              </h2>

              <p className="font-sans text-base text-[rgba(255,255,255,0.75)] max-w-lg leading-relaxed mb-8">
                {contact.subtext}
              </p>

              {/* Big CTA Pill Trigger */}
              <button
                onClick={onOpenContact}
                type="button"
                className="group inline-flex items-center gap-4 pl-8 pr-3 py-3 bg-[#FFE600] text-[#050505] font-display text-2xl sm:text-3xl font-black uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-all duration-150 shadow-[0_0_40px_rgba(255,230,0,0.35)] cursor-pointer mb-8"
              >
                <span>INITIATE PROJECT</span>
                <div className="w-12 h-12 rounded-full bg-[#050505] text-[#FFE600] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* One-Click Copy Email Box */}
              <div className="p-4 bg-[#0C0D10] border border-[rgba(255,255,255,0.15)] flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[rgba(255,255,255,0.4)]">
                    PRIMARY DISPATCH VECTOR
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#FFE600] truncate">
                    {contact.email}
                  </span>
                </div>

                <button
                  onClick={copyEmail}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-[#050505] border border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] text-[#FFFFFF] hover:text-[#FFE600] font-mono text-xs uppercase font-bold rounded-ui transition-colors shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-[#00FF88]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Telemetry Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[rgba(255,255,255,0.1)] font-mono text-xs">
              <div>
                <span className="text-[rgba(255,255,255,0.4)] block uppercase text-[10px] tracking-wider mb-1">
                  LOCATION // TIMEZONE
                </span>
                <span className="text-[#FFFFFF] font-bold">
                  {contact.location}
                </span>
                <span className="text-[rgba(255,255,255,0.6)] block text-[11px]">
                  {contact.timezone}
                </span>
              </div>

              <div>
                <span className="text-[rgba(255,255,255,0.4)] block uppercase text-[10px] tracking-wider mb-1">
                  CURRENT AVAILABILITY
                </span>
                <span className="text-[#00FF88] font-bold">
                  {contact.availability}
                </span>
              </div>
            </div>

            {/* Pill-Shaped Social Links */}
            <div className="pt-4">
              <span className="font-mono text-[10px] uppercase text-[rgba(255,255,255,0.4)] tracking-widest block mb-3">
                ENCRYPTED SOCIAL SIGNALS
              </span>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(socialLinks).map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] text-[rgba(255,255,255,0.85)] hover:text-[#FFE600] font-mono text-xs uppercase font-bold rounded-pill hover:bg-[rgba(255,230,0,0.08)] transition-all"
                  >
                    {getSocialIcon(network)}
                    <span>{network}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / System Status Bar */}
      <div className="py-6 px-4 sm:px-8 md:px-[4.5vw] bg-[#000000] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[rgba(255,255,255,0.4)] uppercase select-none">
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex items-center gap-4">
          <span>SEC.LEVEL: MAXIMUM</span>
          <span>•</span>
          <span className="text-[#FFE600]">{site.systemVersion}</span>
        </div>
      </div>
    </footer>
  );
}
