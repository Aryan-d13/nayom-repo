'use client';

import React, { useState } from 'react';
import { Menu, ArrowRight } from 'lucide-react';
import { SiteData } from '../lib/site-data';
import MenuDrawer from './MenuDrawer';
import ContactModal from './ContactModal';

interface NavigationProps {
  siteData: SiteData;
}

export default function Navigation({ siteData }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[rgba(5,5,5,0.92)] backdrop-blur-md border-b border-[rgba(255,255,255,0.15)] transition-all">
        {/* Top Mini Ruler Bar */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1 bg-[#000000] border-b border-[rgba(255,255,255,0.08)] font-mono text-[9px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest select-none">
          <div className="flex items-center gap-4">
            <span>SYS.LOC // {siteData.site.location}</span>
            <span>FREQ // 4.90 GHz</span>
          </div>
          <div className="flex items-center gap-4 text-[#FFE600]">
            <span className="inline-block w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-ping" />
            <span>{siteData.site.systemVersion}</span>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 md:px-12 py-3.5 max-w-full">
          {/* Left: Menu Trigger + Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsMenuOpen(true)}
              type="button"
              className="flex items-center gap-2.5 px-3 sm:px-4 py-1.5 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] text-[#FFE600] font-mono text-xs font-bold uppercase tracking-wider rounded-ui hover:bg-[#FFE600] hover:text-[#050505] transition-all duration-150 cursor-pointer"
              aria-label="Open Navigation Directory"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>[ MENU ]</span>
            </button>

            <a
              href="#hero"
              className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#FFFFFF] hover:text-[#FFE600] transition-colors"
            >
              {siteData.site.name}
            </a>
          </div>

          {/* Center: Live Operational Status (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#0C0D10] border border-[rgba(255,230,0,0.25)] rounded-pill">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="font-mono text-[11px] text-[rgba(255,255,255,0.85)] tracking-wide uppercase">
              {siteData.site.status}
            </span>
          </div>

          {/* Right: Contact Pill CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsContactOpen(true)}
              type="button"
              className="group flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 bg-[#FFE600] text-[#050505] font-display text-base sm:text-lg font-black uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-all duration-150 cursor-pointer shadow-[0_0_20px_rgba(255,230,0,0.25)]"
            >
              <span>CONTACT</span>
              <div className="w-7 h-7 rounded-full bg-[#050505] text-[#FFE600] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Drawer Overlay */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
        siteData={siteData}
      />

      {/* Contact Form Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        siteData={siteData}
      />
    </>
  );
}
