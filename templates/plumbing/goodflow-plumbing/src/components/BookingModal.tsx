"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { COMPANY, bookingModalContent } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function BookingModal({ isOpen, onClose, defaultService }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [selectedService, setSelectedService] = useState(
    defaultService || COMPANY.services[0]
  );
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [timing, setTiming] = useState(bookingModalContent.urgencyOptions[0]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("form");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#15212A]/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#F4F0E7] text-[#15212A] rounded-none border border-[#15212A]/15 shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] overflow-y-auto overscroll-contain touch-pan-y"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#15212A]/10 pb-5">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#397A91] uppercase">
                  {bookingModalContent.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight mt-1 text-[#15212A]">
                  {bookingModalContent.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#15212A]/70 mt-1">
                  {bookingModalContent.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 text-[#15212A]/60 hover:text-[#15212A] hover:bg-[#15212A]/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === "form" ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-medium tracking-wide uppercase text-[#15212A]/70 mb-2">
                    {bookingModalContent.serviceSelectLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPANY.services.map((srv) => (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setSelectedService(srv)}
                        className={`text-left text-xs sm:text-sm px-3.5 py-2.5 border transition-all cursor-pointer ${
                          selectedService === srv
                            ? "bg-[#397A91] text-white border-[#397A91] font-medium"
                            : "bg-white/80 text-[#15212A] border-[#15212A]/15 hover:border-[#397A91]/60"
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-xs font-medium tracking-wide uppercase text-[#15212A]/70 mb-2">
                    {bookingModalContent.urgencyLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingModalContent.urgencyOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTiming(opt)}
                        className={`text-xs sm:text-sm px-3.5 py-2.5 border text-center transition-all cursor-pointer ${
                          timing === opt
                            ? "bg-[#15212A] text-[#F4F0E7] border-[#15212A]"
                            : "bg-white/80 text-[#15212A] border-[#15212A]/15 hover:border-[#15212A]/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address & Neighborhood */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium tracking-wide uppercase text-[#15212A]/70 mb-1.5">
                      {bookingModalContent.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={bookingModalContent.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#15212A]/20 px-3.5 py-2 text-sm text-[#15212A] placeholder:text-[#15212A]/40 focus:outline-none focus:border-[#397A91] focus:ring-1 focus:ring-[#397A91]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wide uppercase text-[#15212A]/70 mb-1.5">
                      {bookingModalContent.addressLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={bookingModalContent.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-[#15212A]/20 px-3.5 py-2 text-sm text-[#15212A] placeholder:text-[#15212A]/40 focus:outline-none focus:border-[#397A91] focus:ring-1 focus:ring-[#397A91]"
                    />
                  </div>
                </div>

                {/* Brief description */}
                <div>
                  <label className="block text-xs font-medium tracking-wide uppercase text-[#15212A]/70 mb-1.5">
                    {bookingModalContent.noteLabel}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={bookingModalContent.notePlaceholder}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-white border border-[#15212A]/20 p-3 text-sm text-[#15212A] placeholder:text-[#15212A]/40 focus:outline-none focus:border-[#397A91] focus:ring-1 focus:ring-[#397A91]"
                  />
                </div>

                {/* Submit action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#15212A]/10">
                  <a
                    href={COMPANY.phoneRaw}
                    className="flex items-center text-xs text-[#15212A]/80 hover:text-[#397A91] transition-colors gap-1.5 order-2 sm:order-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#397A91]" />
                    <span>
                      {bookingModalContent.callAlternativePrefix} {COMPANY.phone}
                    </span>
                  </a>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#15212A] text-[#F4F0E7] hover:bg-[#397A91] transition-all px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-medium cursor-pointer order-1 sm:order-2"
                  >
                    <span>{bookingModalContent.submitLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#D8E9EA] text-[#397A91] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-normal text-[#15212A]">
                  {bookingModalContent.confirmedTitle}
                </h3>
                <p className="text-sm text-[#15212A]/80 max-w-md mx-auto leading-relaxed">
                  {bookingModalContent.confirmedMessage.part1} <strong>{selectedService}</strong>{" "}
                  {bookingModalContent.confirmedMessage.part2}{" "}
                  {address || bookingModalContent.confirmedMessage.defaultAddress}.{" "}
                  {bookingModalContent.confirmedMessage.part3}{" "}
                  <strong>{phone || COMPANY.phone}</strong>{" "}
                  {bookingModalContent.confirmedMessage.part4}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-[#15212A] text-[#F4F0E7] px-6 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-[#397A91] transition-colors cursor-pointer"
                  >
                    {bookingModalContent.doneButtonLabel}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
