"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookingModalContent, clinicInfo } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState<string>(bookingModalContent.services[0] || "Primary Care");

  // Escape key closes modal
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

  const services = bookingModalContent.services;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Subtle Dim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[3px]"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white border border-dust shadow-2xl p-6 sm:p-10 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute top-6 right-6 text-xs uppercase tracking-widest text-ink/50 hover:text-ink cursor-pointer p-2"
              aria-label="Close booking window"
            >
              [×]
            </button>

            {submitted ? (
              <div className="py-12 text-center">
                <span className="text-sage text-2xl">✓</span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-light text-ink font-sans">
                  {bookingModalContent.success.title}
                </h3>
                <p className="mt-3 text-lg font-serif italic text-sage">
                  {bookingModalContent.success.italicNote}
                </p>
                <p className="mt-6 text-sm text-ink/70 font-sans max-w-sm mx-auto leading-relaxed">
                  {bookingModalContent.success.urgentPrefix}
                  <a href={clinicInfo.phoneTel} className="text-ink underline font-medium">
                    {bookingModalContent.success.phone}
                  </a>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  type="button"
                  className="mt-8 px-6 py-2.5 bg-ink text-white text-xs uppercase tracking-[0.2em] hover:bg-sage transition-colors cursor-pointer"
                >
                  {bookingModalContent.success.closeButton}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-sans font-medium">
                  {bookingModalContent.brandHeader}
                </p>
                <h3
                  id="modal-headline"
                  className="mt-2 text-2xl sm:text-3xl font-light tracking-tight text-ink uppercase font-sans"
                >
                  {bookingModalContent.headline}
                </h3>
                <p className="mt-2 text-base font-serif italic text-sage">
                  {bookingModalContent.italicSub}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 font-sans">
                  {/* Service selector */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-ink/70 mb-2">
                      {bookingModalContent.form.careLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedService(s)}
                          className={`text-xs px-3.5 py-2 border transition-colors cursor-pointer ${
                            selectedService === s
                              ? "bg-ink text-white border-ink"
                              : "bg-ivory/50 text-ink/80 border-dust hover:border-ink/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Phone/Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="patient-name"
                        className="block text-[11px] uppercase tracking-[0.18em] text-ink/70 mb-1"
                      >
                        {bookingModalContent.form.nameLabel}
                      </label>
                      <input
                        id="patient-name"
                        required
                        type="text"
                        placeholder={bookingModalContent.form.namePlaceholder}
                        className="w-full text-sm px-3.5 py-2.5 bg-ivory/40 border border-dust focus:border-sage focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="patient-phone"
                        className="block text-[11px] uppercase tracking-[0.18em] text-ink/70 mb-1"
                      >
                        {bookingModalContent.form.contactLabel}
                      </label>
                      <input
                        id="patient-phone"
                        required
                        type="text"
                        placeholder={bookingModalContent.form.contactPlaceholder}
                        className="w-full text-sm px-3.5 py-2.5 bg-ivory/40 border border-dust focus:border-sage focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Brief note */}
                  <div>
                    <label
                      htmlFor="patient-note"
                      className="block text-[11px] uppercase tracking-[0.18em] text-ink/70 mb-1"
                    >
                      {bookingModalContent.form.noteLabel}
                    </label>
                    <textarea
                      id="patient-note"
                      rows={3}
                      placeholder={bookingModalContent.form.notePlaceholder}
                      className="w-full text-sm p-3 bg-ivory/40 border border-dust focus:border-sage focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <p className="text-[11px] text-ink/60">
                      {bookingModalContent.form.callDirectLabel}
                      <a href={clinicInfo.phoneTel} className="text-ink font-medium underline">
                        {bookingModalContent.success.phone}
                      </a>
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-ink text-white hover:bg-sage text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      {bookingModalContent.form.submitText}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
