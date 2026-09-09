'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { SiteData } from '../lib/site-data';
import { soundFx } from '../lib/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
}

export default function ContactModal({ isOpen, onClose, siteData }: ContactModalProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    email: '',
    projectScope: 'SYSTEMS_ARCHITECTURE',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    soundFx.playTransmission();

    setTimeout(() => {
      setIsTransmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      senderName: '',
      email: '',
      projectScope: 'SYSTEMS_ARCHITECTURE',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
      {/* Container Frame */}
      <div className="relative w-full max-w-2xl bg-[#050505] border-2 border-[#FFE600] shadow-[0_0_50px_rgba(255,230,0,0.25)] overflow-hidden">
        {/* Top Hazard Tape Ribbon */}
        <div className="w-full h-4 bg-hazard-sm" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.15)] bg-[#0C0D10]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 bg-[#FFE600] rounded-full animate-ping" />
            <span className="font-mono text-xs font-bold text-[#FFE600] uppercase tracking-widest">
              [ TRANSMISSION PROTOCOL // INITIALIZE ]
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-[rgba(255,255,255,0.6)] hover:text-[#FFE600] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {isSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(0,255,136,0.15)] border-2 border-[#00FF88] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#00FF88]" />
              </div>
              <h3 className="font-display text-4xl text-[#FFFFFF] mb-2">
                TRANSMISSION DISPATCHED
              </h3>
              <p className="font-mono text-xs text-[rgba(255,255,255,0.7)] max-w-md mb-8">
                Signal routed to {siteData.contact.email}. Expected triage and architectural response within 4 hours.
              </p>
              <button
                onClick={handleReset}
                type="button"
                className="px-8 py-3 bg-[#FFE600] text-[#050505] font-display text-xl uppercase tracking-wider rounded-pill hover:bg-[#FFFFFF] transition-colors"
              >
                CLOSE TERMINAL [x]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.6)] mb-1.5">
                    IDENTIFIER / NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    placeholder="E.g. Dr. Alexander Vance"
                    className="w-full px-4 py-3 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] text-[#FFFFFF] font-mono text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.6)] mb-1.5">
                    COMMUNICATION VECTOR (EMAIL) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alexander@domain.com"
                    className="w-full px-4 py-3 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] text-[#FFFFFF] font-mono text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.6)] mb-1.5">
                  SYSTEM ENGAGEMENT SCOPE
                </label>
                <select
                  value={formData.projectScope}
                  onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] text-[#FFE600] font-mono text-sm focus:outline-none focus:border-[#FFE600]"
                >
                  <option value="SYSTEMS_ARCHITECTURE">DISTRIBUTED CLOUD ARCHITECTURE</option>
                  <option value="WEBGL_COMPUTE">WEBGL & 3D INTERACTIVE PIPELINE</option>
                  <option value="BRUTALIST_SURFACE">TACTICAL FRONTEND REDESIGN</option>
                  <option value="EMBEDDED_LEADERSHIP">SKUNKWORKS / TECHNICAL ADVISORY</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.6)] mb-1.5">
                  TRANSMISSION PAYLOAD (BRIEF / REQUIREMENTS) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline key system constraints, throughput requirements, target timeline, and stack preferences..."
                  className="w-full px-4 py-3 bg-[#0C0D10] border border-[rgba(255,255,255,0.2)] text-[#FFFFFF] font-mono text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">
                  ENCRYPTION: TLS 1.3 // ZERO LOGGING
                </span>
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFE600] text-[#050505] font-display text-lg uppercase tracking-wider font-bold rounded-pill hover:bg-[#FFFFFF] transition-all duration-150 disabled:opacity-50"
                >
                  {isTransmitting ? (
                    <span>TRANSMITTING SIGNAL...</span>
                  ) : (
                    <>
                      <span>TRANSMIT SIGNAL</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Status Ticker */}
        <div className="px-6 py-2 bg-[#0C0D10] border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between font-mono text-[10px] text-[rgba(255,255,255,0.4)]">
          <span>PORT: 8080 // SECURE LINK</span>
          <span>LOCATION: {siteData.contact.location}</span>
        </div>
      </div>
    </div>
  );
}
