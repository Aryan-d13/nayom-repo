"use client";

import React, { useState, useEffect } from "react";
import { useAir } from "@/context/AirContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import { bookingModalContent, companyInfo } from "@/data/content";

export default function BookingModal() {
  const { isBookingOpen, setIsBookingOpen, bookingService } = useAir();
  const [selectedService, setSelectedService] = useState(bookingService || bookingModalContent.services[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (bookingService) {
      setSelectedService(bookingService);
    }
  }, [bookingService]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBookingOpen(false);
      }
    };
    if (isBookingOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isBookingOpen, setIsBookingOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsBookingOpen(false);
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsBookingOpen(false)}
            className="absolute inset-0 bg-[#202321]/70 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#F4F1E9] text-[#202321] border border-[#202321]/20 shadow-2xl p-6 sm:p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#202321]/60 hover:text-[#202321] transition-colors focus:outline-none"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#607F87]/15 flex items-center justify-center text-[#607F87]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                  {bookingModalContent.success.title}
                </h3>
                <p className="text-sm text-[#202321]/75 max-w-sm mx-auto">
                  {bookingModalContent.success.prefix}{name || bookingModalContent.success.defaultNeighbor}{bookingModalContent.success.middle}
                  {phone || companyInfo.phone}{bookingModalContent.success.suffix}
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#607F87]">
                    {bookingModalContent.badge}
                  </span>
                  <h3
                    id="modal-title"
                    className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#202321] mt-1 font-sans"
                  >
                    {bookingModalContent.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#202321]/70 mt-1 font-serif italic text-lg">
                    {bookingModalContent.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Choice */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#202321]/70 mb-2">
                      {bookingModalContent.form.serviceLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {bookingModalContent.services.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setSelectedService(srv)}
                          className={`px-3.5 py-2 text-xs uppercase font-semibold tracking-wider transition-all duration-200 border ${
                            selectedService === srv
                              ? "bg-[#202321] text-[#F4F1E9] border-[#202321]"
                              : "bg-[#FBFBF8] text-[#202321]/80 border-[#202321]/15 hover:border-[#202321]/50"
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#202321]/70 mb-1.5">
                        {bookingModalContent.form.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={bookingModalContent.form.namePlaceholder}
                        className="w-full px-4 py-3 bg-[#FBFBF8] border border-[#202321]/20 text-[#202321] text-sm focus:outline-none focus:border-[#202321]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#202321]/70 mb-1.5">
                        {bookingModalContent.form.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={companyInfo.phone}
                        className="w-full px-4 py-3 bg-[#FBFBF8] border border-[#202321]/20 text-[#202321] text-sm focus:outline-none focus:border-[#202321]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#202321]/70 mb-1.5">
                      {bookingModalContent.form.addressLabel}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={bookingModalContent.form.addressPlaceholder}
                      className="w-full px-4 py-3 bg-[#FBFBF8] border border-[#202321]/20 text-[#202321] text-sm focus:outline-none focus:border-[#202321]"
                    />
                  </div>

                  {/* What feels off? */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#202321]/70 mb-1.5">
                      {bookingModalContent.form.noteLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={bookingModalContent.form.notePlaceholder}
                      className="w-full px-4 py-2.5 bg-[#FBFBF8] border border-[#202321]/20 text-[#202321] text-sm focus:outline-none focus:border-[#202321]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#202321] text-[#F4F1E9] text-xs uppercase tracking-widest font-bold hover:bg-[#607F87] transition-colors shadow-md"
                    >
                      <span>{bookingModalContent.form.submitText}</span>
                      <ArrowRight className="w-4 h-4" />
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
