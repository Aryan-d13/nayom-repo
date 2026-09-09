"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { bookingModalContent, businessInfo } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const SERVICES = bookingModalContent.services;
const TIME_WINDOWS = bookingModalContent.timeWindows;

export default function BookingModal({
  isOpen,
  onClose,
  defaultService = "Plumbing Repairs",
}: BookingModalProps) {
  const [selectedService, setSelectedService] = useState(defaultService);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [timeWindow, setTimeWindow] = useState<string>(TIME_WINDOWS[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#17252A]/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-xl bg-[#FFFDF8] border border-[#17252A]/15 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
          >
            {/* Top decorative water line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#68B8C3] via-[#DDF0EC] to-[#C86650]" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-[#17252A]/60 hover:text-[#17252A] transition-colors rounded-full hover:bg-[#F3EFE7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68B8C3]"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="mb-6">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#68B8C3]">
                    {bookingModalContent.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#17252A] mt-1">
                    {bookingModalContent.title}
                  </h3>
                  <p className="text-sm text-[#17252A]/70 mt-1 font-sans">
                    {bookingModalContent.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1.5">
                      {bookingModalContent.servicesLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedService(s)}
                          className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                            selectedService === s
                              ? "bg-[#17252A] text-[#FFFDF8] border-[#17252A]"
                              : "bg-[#F3EFE7]/50 text-[#17252A] border-[#17252A]/15 hover:border-[#68B8C3]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1">
                        {bookingModalContent.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={bookingModalContent.namePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#17252A]/20 bg-[#F3EFE7]/30 text-[#17252A] placeholder:text-[#17252A]/40 text-sm focus:border-[#68B8C3] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1">
                        {bookingModalContent.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={bookingModalContent.phonePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#17252A]/20 bg-[#F3EFE7]/30 text-[#17252A] placeholder:text-[#17252A]/40 text-sm focus:border-[#68B8C3] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1">
                      {bookingModalContent.addressLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={bookingModalContent.addressPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#17252A]/20 bg-[#F3EFE7]/30 text-[#17252A] placeholder:text-[#17252A]/40 text-sm focus:border-[#68B8C3] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1.5">
                      {bookingModalContent.timeWindowLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {TIME_WINDOWS.map((tw) => (
                        <button
                          key={tw}
                          type="button"
                          onClick={() => setTimeWindow(tw)}
                          className={`text-xs px-2.5 py-2 rounded-lg border text-center transition-all ${
                            timeWindow === tw
                              ? "bg-[#68B8C3] text-[#17252A] font-medium border-[#68B8C3]"
                              : "bg-[#F3EFE7]/40 text-[#17252A]/80 border-[#17252A]/15 hover:border-[#68B8C3]"
                          }`}
                        >
                          {tw}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#17252A]/70 mb-1">
                      {bookingModalContent.notesLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={bookingModalContent.notesPlaceholder}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#17252A]/20 bg-[#F3EFE7]/30 text-[#17252A] placeholder:text-[#17252A]/40 text-sm focus:border-[#68B8C3] focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <a
                      href={`tel:${businessInfo.phoneTel}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#17252A]/70 hover:text-[#17252A] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#68B8C3]" />
                      {businessInfo.phone}
                    </a>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C86650] text-[#FFFDF8] hover:bg-[#b55844] text-sm font-medium tracking-wide transition-all shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C86650]"
                    >
                      <span>{bookingModalContent.submitButton}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-16 h-16 bg-[#DDF0EC] text-[#17252A] rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-9 h-9 text-[#68B8C3]" />
                </motion.div>

                <h3 className="text-2xl font-light text-[#17252A]">
                  {bookingModalContent.successTitle}
                </h3>
                <p className="text-sm text-[#17252A]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#17252A]">{name}</strong>. A Current Plumbing technician will call you shortly at <strong className="text-[#17252A]">{phone}</strong> to confirm your {timeWindow.toLowerCase()} visit at {address}.
                </p>

                <div className="p-4 rounded-xl bg-[#F3EFE7] text-left text-xs text-[#17252A]/80 space-y-1.5 max-w-sm mx-auto">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#68B8C3]" />
                    <span>Arrival window: {timeWindow}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#68B8C3]" />
                    <span className="truncate">{address}</span>
                  </div>
                  <div className="text-[11px] text-[#17252A]/60 pt-1 border-t border-[#17252A]/10">
                    Service: {selectedService}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-[#17252A] text-[#FFFDF8] text-xs font-medium tracking-wider uppercase hover:bg-[#17252A]/90 transition-all"
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
