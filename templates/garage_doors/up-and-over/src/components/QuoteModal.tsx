"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, Check } from "lucide-react";
import { quoteModalContent, businessInfo } from "@/data/content";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  defaultNote?: string;
}

export default function QuoteModal({
  isOpen,
  onClose,
  defaultService = "Garage Door Replacement",
  defaultNote = "",
}: QuoteModalProps) {
  const [service, setService] = useState(defaultService);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState(defaultNote);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (defaultService) setService(defaultService);
    if (defaultNote) setNotes(defaultNote);
  }, [defaultService, defaultNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulated success
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111311]/75 backdrop-blur-sm transition-opacity"
    >
      <div
        className="relative w-full max-w-xl bg-[#F5F1E8] text-[#202321] shadow-2xl border border-[#D4D0C7] rounded-none overflow-hidden transition-all duration-300"
        style={{
          boxShadow: "0 25px 50px -12px rgba(17, 19, 17, 0.35)",
        }}
      >
        {/* Top subtle bar */}
        <div className="h-1.5 w-full bg-[#A85F45]" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[11px] font-mono tracking-[0.2em] text-[#A85F45] uppercase mb-1">
                {quoteModalContent.headerTag}
              </p>
              <h2
                id="modal-title"
                className="font-serif text-3xl font-light text-[#202321] tracking-tight"
              >
                {submitted ? quoteModalContent.titleSubmitted : quoteModalContent.titleDefault}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 -mr-2 -mt-2 text-[#202321]/60 hover:text-[#202321] hover:bg-[#D4D0C7]/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#53645A]/15 flex items-center justify-center text-[#53645A]">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-serif text-2xl text-[#202321]">
                {quoteModalContent.thankYouTitle} {name || quoteModalContent.thankYouDefaultName}.
              </p>
              <p className="text-sm text-[#202321]/80 max-w-sm mx-auto leading-relaxed">
                {quoteModalContent.thankYouBodyPart1} {service.toLowerCase()}. {quoteModalContent.thankYouBodyPart2}{" "}
                <span className="font-medium text-[#202321]">{phone || businessInfo.phone}</span>.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#202321] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45] transition-colors"
                >
                  {quoteModalContent.closeBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#202321]/70 mb-1.5">
                  {quoteModalContent.services ? "Service Requested" : ""}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {quoteModalContent.services.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setService(item)}
                      className={`px-3 py-2 text-left border transition-all ${
                        service === item
                          ? "border-[#A85F45] bg-[#A85F45]/10 text-[#202321] font-medium"
                          : "border-[#D4D0C7] bg-white/50 text-[#202321]/75 hover:border-[#202321]/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[#202321]/70 mb-1">
                    {quoteModalContent.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={quoteModalContent.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/70 border border-[#D4D0C7] text-sm focus:outline-none focus:border-[#A85F45] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[#202321]/70 mb-1">
                    {quoteModalContent.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={quoteModalContent.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white/70 border border-[#D4D0C7] text-sm focus:outline-none focus:border-[#A85F45] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#202321]/70 mb-1">
                  {quoteModalContent.addressLabel}
                </label>
                <input
                  type="text"
                  placeholder={quoteModalContent.addressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 border border-[#D4D0C7] text-sm focus:outline-none focus:border-[#A85F45] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#202321]/70 mb-1">
                  {quoteModalContent.notesLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={quoteModalContent.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 border border-[#D4D0C7] text-sm focus:outline-none focus:border-[#A85F45] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-[#202321]/60 font-mono">
                  {quoteModalContent.directLineLabel}{" "}
                  <a href={`tel:${businessInfo.phoneTel}`} className="underline text-[#202321]">
                    {businessInfo.phone}
                  </a>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#202321] text-[#F5F1E8] text-xs font-mono tracking-widest uppercase hover:bg-[#A85F45] transition-colors"
                >
                  {quoteModalContent.submitCta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
