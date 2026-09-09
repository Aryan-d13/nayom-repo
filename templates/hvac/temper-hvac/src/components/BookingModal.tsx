"use client";

import React, { useState, useEffect } from "react";
import { useTemperature } from "@/context/TemperatureContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Phone, Clock, MapPin, ArrowRight } from "lucide-react";
import { bookingModalContent, businessInfo } from "@/data/content";

export default function BookingModal() {
  const { isBookingOpen, closeBooking, selectedIssue } = useTemperature();

  const [issue, setIssue] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [timeWindow, setTimeWindow] = useState<string>(bookingModalContent.defaultTimeWindow);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Sync initial issue if provided via context
  useEffect(() => {
    if (selectedIssue) {
      setIssue(selectedIssue);
    } else {
      setIssue(bookingModalContent.defaultIssue);
    }
  }, [selectedIssue, isBookingOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isBookingOpen) {
        closeBooking();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBookingOpen, closeBooking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    closeBooking();
  };

  const issuesList = bookingModalContent.issuesList;

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-[#FCFCF9] text-ink rounded-3xl shadow-2xl border border-sand/60 overflow-hidden my-8 z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            {/* Header */}
            <div className="bg-[#F6F2EA] px-6 sm:px-8 py-6 border-b border-sand/50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta">
                  {bookingModalContent.overline}
                </span>
                <h3 id="booking-modal-title" className="text-2xl font-sans font-bold text-ink mt-1">
                  {bookingModalContent.title}
                </h3>
                <p className="text-xs text-slate mt-1">
                  {bookingModalContent.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close dialog"
                className="p-2 rounded-full text-slate hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 sm:p-10 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-sand/40 text-terracotta flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-terracotta" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-sans font-bold text-ink">
                    {bookingModalContent.success.title}
                  </h4>
                  <p className="text-sm text-slate leading-relaxed max-w-md mx-auto">
                    {bookingModalContent.success.prefix}{name || bookingModalContent.success.defaultNeighbor}{bookingModalContent.success.middle}
                    <span className="font-mono text-ink font-semibold">{phone || bookingModalContent.success.defaultPhone}</span>{bookingModalContent.success.confirmPrefix}{timeWindow.toLowerCase()}{bookingModalContent.success.confirmSuffix}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand/40">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-6 py-3 rounded-full bg-ink text-white hover:bg-terracotta transition-colors text-xs uppercase tracking-[0.18em] cursor-pointer"
                  >
                    {bookingModalContent.success.doneButton}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Situation / Issue Picker */}
                <div className="space-y-2">
                  <label htmlFor="issue-select" className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    {bookingModalContent.issuesLabel}
                  </label>
                  <select
                    id="issue-select"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate/20 bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
                  >
                    {issuesList.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wider text-ink">
                      {bookingModalContent.nameLabel}
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      placeholder={bookingModalContent.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate/20 bg-white text-sm text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wider text-ink">
                      {bookingModalContent.phoneLabel}
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      placeholder={bookingModalContent.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate/20 bg-white text-sm text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-terracotta font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label htmlFor="address-input" className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    {bookingModalContent.addressLabel}
                  </label>
                  <div className="relative">
                    <input
                      id="address-input"
                      type="text"
                      required
                      placeholder={bookingModalContent.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate/20 bg-white text-sm text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
                    />
                    <MapPin className="w-4 h-4 text-slate/60 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Preferred Window */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                    {bookingModalContent.timeWindowLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {bookingModalContent.timeWindows.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeWindow(slot)}
                        className={`px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          timeWindow === slot
                            ? "border-terracotta bg-terracotta/10 text-terracotta font-semibold"
                            : "border-slate/20 bg-white text-slate hover:border-slate/40"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit & Phone call alternative */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full bg-ink text-white hover:bg-terracotta transition-all duration-300 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <span>{bookingModalContent.submitCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-slate">
                    {bookingModalContent.immediatePrefix}
                    <a href={`tel:${businessInfo.phoneTel}`} className="text-ink font-semibold font-mono underline hover:text-terracotta">
                      {bookingModalContent.phone}
                    </a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
