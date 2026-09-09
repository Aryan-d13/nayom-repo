"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { bookingModalContent } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = bookingModalContent.services;

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    neighborhood: "",
    notes: "",
    timeOfDay: "morning",
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#242522]/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FAFAF7] border border-[#A86F4F]/40 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Top architectural bar */}
            <div className="px-8 py-6 border-b border-[#D4D0C7] flex items-center justify-between bg-[#E9E7E1]/60">
              <div>
                <span className="text-[10px] tracking-[0.28em] font-mono uppercase text-[#A86F4F] block mb-1">
                  {bookingModalContent.badge}
                </span>
                <h3 className="text-xl sm:text-2xl tracking-tight font-medium text-[#242522]">
                  {bookingModalContent.title}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#242522]/60 hover:text-[#242522] hover:bg-[#D4D0C7]/50 rounded-none transition-colors"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#A8C7C8]/30 flex items-center justify-center text-[#242522] mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#242522]" />
                  </div>
                  <h4 className="text-2xl sm:text-3xl tracking-tight font-normal text-[#242522] mb-3">
                    {bookingModalContent.successTitle}
                  </h4>
                  <p className="text-base text-[#242522]/75 max-w-md mx-auto mb-8 font-normal leading-relaxed">
                    {bookingModalContent.successMessage}
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-[12px] tracking-[0.2em] uppercase font-semibold text-[#FAFAF7] bg-[#242522] hover:bg-[#A86F4F] px-8 py-3.5 transition-colors"
                  >
                    {bookingModalContent.resetButton}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-3">
                      {bookingModalContent.servicesLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedService(s)}
                          className={`text-[12px] tracking-wide px-4 py-2.5 transition-all text-left border ${
                            selectedService === s
                              ? "border-[#242522] bg-[#242522] text-[#FAFAF7]"
                              : "border-[#D4D0C7] bg-[#FAFAF7] text-[#242522]/80 hover:border-[#A86F4F]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-2">
                        {bookingModalContent.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={bookingModalContent.namePlaceholder}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#FAFAF7] border border-[#D4D0C7] px-4 py-3 text-sm text-[#242522] placeholder-[#242522]/30 focus:border-[#A86F4F] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-2">
                        {bookingModalContent.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={bookingModalContent.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-[#FAFAF7] border border-[#D4D0C7] px-4 py-3 text-sm text-[#242522] placeholder-[#242522]/30 focus:border-[#A86F4F] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Seattle Neighborhood */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-2">
                      {bookingModalContent.neighborhoodLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={bookingModalContent.neighborhoodPlaceholder}
                      value={formData.neighborhood}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          neighborhood: e.target.value,
                        })
                      }
                      className="w-full bg-[#FAFAF7] border border-[#D4D0C7] px-4 py-3 text-sm text-[#242522] placeholder-[#242522]/30 focus:border-[#A86F4F] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Details / What is happening */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-2">
                      {bookingModalContent.notesLabel}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={bookingModalContent.notesPlaceholder}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-[#FAFAF7] border border-[#D4D0C7] px-4 py-3 text-sm text-[#242522] placeholder-[#242522]/30 focus:border-[#A86F4F] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Time Window Preference */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#242522]/70 mb-2">
                      {bookingModalContent.timingLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {bookingModalContent.timingOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, timeOfDay: opt.id })
                          }
                          className={`py-2.5 px-3 text-[12px] border text-center transition-all ${
                            formData.timeOfDay === opt.id
                              ? "border-[#A86F4F] bg-[#E9E7E1] text-[#242522] font-semibold"
                              : "border-[#D4D0C7] text-[#242522]/70"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-[#D4D0C7] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#242522]/60">
                      {bookingModalContent.phoneDisplay}
                    </span>

                    <button
                      type="submit"
                      className="inline-flex items-center space-x-2 text-[12px] tracking-[0.22em] uppercase font-semibold text-[#FAFAF7] bg-[#242522] hover:bg-[#A86F4F] px-7 py-3.5 transition-colors"
                    >
                      <span>{bookingModalContent.submitButton}</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
