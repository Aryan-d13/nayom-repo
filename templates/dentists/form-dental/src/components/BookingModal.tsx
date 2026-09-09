"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { clinicInfo, bookingModalContent } from "@/data/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState(bookingModalContent.topics[0]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-bone rounded-sm border border-stone/30 shadow-2xl p-6 sm:p-10 z-10 text-ink"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-6 right-6 p-2 text-ink/60 hover:text-ink transition-colors focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-ink/50 font-medium mb-2">
                  {bookingModalContent.eyebrow}
                </p>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-light tracking-tight text-ink mb-2"
                >
                  {bookingModalContent.title}
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed mb-6 font-normal">
                  {bookingModalContent.description}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs uppercase tracking-wider text-ink/70 mb-1.5 font-medium"
                    >
                      {bookingModalContent.nameLabel}
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      placeholder={bookingModalContent.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone/40 text-ink placeholder:text-ink/30 rounded-none text-sm focus:outline-none focus:border-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs uppercase tracking-wider text-ink/70 mb-1.5 font-medium"
                    >
                      {bookingModalContent.contactLabel}
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      required
                      placeholder={bookingModalContent.contactPlaceholder}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone/40 text-ink placeholder:text-ink/30 rounded-none text-sm focus:outline-none focus:border-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-ink/70 mb-1.5 font-medium">
                      {bookingModalContent.topicLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {bookingModalContent.topics.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setTopic(item)}
                          className={`px-3 py-2 text-left border transition-colors ${
                            topic === item
                              ? "border-ink bg-ink text-bone font-medium"
                              : "border-stone/40 bg-white/60 text-ink hover:border-stone"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs uppercase tracking-wider text-ink/70 mb-1.5 font-medium"
                    >
                      {bookingModalContent.notesLabel}{" "}
                      <span className="text-ink/40 font-normal lowercase">
                        {bookingModalContent.notesOptional}
                      </span>
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={2}
                      placeholder={bookingModalContent.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone/40 text-ink placeholder:text-ink/30 rounded-none text-sm focus:outline-none focus:border-ink transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-ink text-bone hover:bg-ink/90 font-medium text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
                    >
                      <span>{bookingModalContent.submitButton}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-stone/20 text-center">
                  <p className="text-xs text-ink-muted">
                    {bookingModalContent.callPrompt}
                    <a
                      href={`tel:${clinicInfo.phoneRaw}`}
                      className="text-ink underline hover:text-clay transition-colors font-medium"
                    >
                      {clinicInfo.phone}
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-clay/10 text-clay flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-light text-ink tracking-tight">
                  {bookingModalContent.successTitle}
                </h3>
                <p className="text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
                  {bookingModalContent.successMessagePrefix}, {name || "friend"}. We will reach out to{" "}
                  <span className="font-medium text-ink">{contact}</span>{" "}
                  {bookingModalContent.successMessageSuffix}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-ink text-ink text-xs uppercase tracking-widest font-medium hover:bg-ink hover:text-bone transition-colors"
                  >
                    {bookingModalContent.closeButton}
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
