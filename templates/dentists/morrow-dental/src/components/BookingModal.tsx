"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clinicData, bookingModalContent } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<string>(clinicData.services[0]);
  const [preferredTime, setPreferredTime] = useState<string>(bookingModalContent.timeOptions[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative w-full max-w-xl bg-porcelain border border-stone/50 shadow-2xl p-6 sm:p-10 max-h-[85vh] overflow-y-auto overscroll-contain touch-pan-y modal-scroll"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close booking modal"
              className="absolute top-6 right-6 text-ink/60 hover:text-ink text-xs uppercase tracking-widest transition-colors py-2 px-3 cursor-pointer"
            >
              {bookingModalContent.closeLabel}
            </button>

            {!isSubmitted ? (
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-ink/50 block mb-2">
                  {clinicData.city} {bookingModalContent.eyebrowSuffix}
                </span>
                <h3
                  id="booking-title"
                  className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight mb-2"
                >
                  {bookingModalContent.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed mb-6 font-light">
                  {bookingModalContent.description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-ink/70 mb-2">
                      {bookingModalContent.serviceLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {clinicData.services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className={`text-left px-3 py-2 text-xs transition-colors border cursor-pointer ${
                            selectedService === service
                              ? "border-ink bg-ink text-porcelain"
                              : "border-stone/40 bg-porcelain-light text-ink hover:border-ink/60"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timing */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-ink/70 mb-2">
                      {bookingModalContent.timeLabel}
                    </label>
                    <div className="flex gap-2">
                      {bookingModalContent.timeOptions.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setPreferredTime(time)}
                          className={`px-4 py-2 text-xs transition-colors border cursor-pointer ${
                            preferredTime === time
                              ? "border-ink bg-ink text-porcelain"
                              : "border-stone/40 bg-porcelain-light text-ink hover:border-ink/60"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label
                        htmlFor="patient-name"
                        className="block text-xs uppercase tracking-widest text-ink/70 mb-1"
                      >
                        {bookingModalContent.nameLabel}
                      </label>
                      <input
                        id="patient-name"
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={bookingModalContent.namePlaceholder}
                        className="w-full bg-porcelain-light border border-stone/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="patient-contact"
                        className="block text-xs uppercase tracking-widest text-ink/70 mb-1"
                      >
                        {bookingModalContent.contactLabel}
                      </label>
                      <input
                        id="patient-contact"
                        required
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={bookingModalContent.contactPlaceholder}
                        className="w-full bg-porcelain-light border border-stone/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="patient-note"
                        className="block text-xs uppercase tracking-widest text-ink/70 mb-1"
                      >
                        {bookingModalContent.noteLabel}{" "}
                        <span className="text-ink/40 font-normal lowercase">{bookingModalContent.noteOptional}</span>
                      </label>
                      <textarea
                        id="patient-note"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={bookingModalContent.notePlaceholder}
                        className="w-full bg-porcelain-light border border-stone/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-ink text-porcelain hover:bg-ink-light text-xs uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      {bookingModalContent.submitButton}
                    </button>
                    <span className="text-xs text-ink/50">
                      {bookingModalContent.callDirectLabel}<a href={`tel:${clinicData.phoneRaw}`} className="underline hover:text-ink">{clinicData.phone}</a>
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <span className="text-xs font-mono tracking-widest uppercase text-ink/50 block">
                  {bookingModalContent.successEyebrow}
                </span>
                <h4 className="font-serif text-3xl sm:text-4xl text-ink font-light">
                  {bookingModalContent.successTitlePrefix}{name.split(" ")[0] || "friend"}.
                </h4>
                <p className="text-sm text-ink/70 max-w-md mx-auto leading-relaxed font-light">
                  {bookingModalContent.successMessagePart1}{contact || "your contact information"}{bookingModalContent.successMessagePart2}
                </p>
                <div className="p-4 bg-porcelain-dark/40 border border-stone/40 max-w-sm mx-auto text-xs text-ink/70 text-left space-y-1">
                  <div><strong>{bookingModalContent.focusLabel}</strong> {selectedService}</div>
                  <div><strong>{bookingModalContent.locationLabel}</strong> {clinicData.address}</div>
                  <div><strong>{bookingModalContent.hoursLabel}</strong> {clinicData.hours}</div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-ink text-porcelain text-xs uppercase tracking-widest transition-colors hover:bg-ink-light cursor-pointer"
                  >
                    {bookingModalContent.doneButton}
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
