'use client';

import React, { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { SiteData } from '../lib/site-data';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
  siteData: SiteData;
}

export default function MenuDrawer({
  isOpen,
  onClose,
  onOpenContact,
  siteData,
}: MenuDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { num: '01', label: 'INITIALIZE // HERO', href: '#hero' },
    { num: '02', label: 'ARCHITECTURE // ABOUT', href: '#about' },
    { num: '03', label: 'CAPABILITIES // EXPERTISE', href: '#expertise' },
    { num: '04', label: 'CASE STUDIES // PROJECTS', href: '#projects' },
    { num: '05', label: 'TELEMETRY // TESTIMONIALS', href: '#testimonials' },
    { num: '06', label: 'PROTOCOLS // FAQ', href: '#faq' },
    { num: '07', label: 'TRANSMISSION // CONTACT', href: '#contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-[#FFFFFF] animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-[rgba(255,255,255,0.15)] bg-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#FFE600] animate-ping" />
          <span className="font-mono text-sm font-bold text-[#FFE600] tracking-widest uppercase">
            [ SYSTEM DIRECTORY // {siteData.site.name} ]
          </span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] text-[#FFE600] font-mono text-xs uppercase tracking-wider rounded-pill hover:bg-[#FFE600] hover:text-[#050505] transition-all"
        >
          <span>CLOSE DIRECTORY [ESC]</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Drawer Links Grid */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Column: Big Navigation Links */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.1)] hover:border-[#FFE600] transition-colors"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#FFE600] font-bold">
                  {item.num}
                </span>
                <span className="font-display text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] group-hover:text-[#FFE600] group-hover:translate-x-3 transition-transform duration-200">
                  {item.label}
                </span>
              </div>
              <ArrowUpRight className="w-6 h-6 text-[rgba(255,255,255,0.4)] group-hover:text-[#FFE600] group-hover:scale-125 transition-all" />
            </a>
          ))}
        </div>

        {/* Right Column: Status & Contact Specs */}
        <div className="lg:col-span-4 bg-[#0C0D10] border border-[rgba(255,255,255,0.15)] p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFE600] block mb-1">
              CURRENT DEPLOYMENT STATUS
            </span>
            <p className="font-mono text-sm text-[#FFFFFF] font-bold">
              {siteData.site.status}
            </p>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)] block mb-1">
              DIRECT DISPATCH
            </span>
            <a
              href={`mailto:${siteData.contact.email}`}
              className="font-mono text-sm text-[#FFE600] hover:underline"
            >
              {siteData.contact.email}
            </a>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)] block mb-1">
              COORDINATES & TIMEZONE
            </span>
            <p className="font-mono text-xs text-[rgba(255,255,255,0.8)]">
              {siteData.contact.location} // {siteData.contact.timezone}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            type="button"
            className="w-full py-4 bg-[#FFE600] text-[#050505] font-display text-2xl uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-colors"
          >
            DISPATCH TRANSMISSION [→]
          </button>
        </div>
      </div>

      {/* Bottom Hazard Ribbon */}
      <div className="w-full h-4 bg-hazard-sm" />
    </div>
  );
}
