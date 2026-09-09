"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { FIRM_INFO, contactDrawerContent } from "@/data/content";

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prefillInquiry?: string;
}

export function ContactDrawer({
  isOpen,
  onClose,
  prefillInquiry = "",
}: ContactDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    practiceArea: "Business",
    narrative: prefillInquiry,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefillInquiry) {
      setFormData((prev) => ({ ...prev, narrative: prefillInquiry }));
    }
  }, [prefillInquiry]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      contact: "",
      practiceArea: "Business",
      narrative: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#171817]/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-[#FCFBF7] text-[#171817] shadow-2xl border-l border-[#D8D4CA] flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-[#171817]/10 flex items-start justify-between bg-[#F1EEE7]">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#555650] block mb-1">
                  {contactDrawerContent.intakeLabel}
                </span>
                <h2
                  id="drawer-title"
                  className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#171817]"
                >
                  {contactDrawerContent.title}
                </h2>
                <p className="font-sans text-xs md:text-sm text-[#555650] mt-1">
                  {contactDrawerContent.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#171817]/10 transition-colors text-[#555650] hover:text-[#171817]"
                aria-label="Close dialogue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-10 flex-1">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#9C3C35]/10 text-[#9C3C35] flex items-center justify-center mx-auto mb-6">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#171817] mb-3">
                    {contactDrawerContent.successTitle}
                  </h3>
                  <p className="text-sm text-[#555650] max-w-sm mx-auto leading-relaxed mb-6">
                    {contactDrawerContent.successMessage}
                  </p>
                  <div className="font-mono text-xs text-[#555650] border-t border-[#171817]/10 pt-4 max-w-xs mx-auto">
                    {contactDrawerContent.urgentLineLabel}{" "}
                    <span className="text-[#171817] font-semibold">{FIRM_INFO.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-medium text-[#FCFBF7] bg-[#171817] hover:bg-[#9C3C35] transition-colors"
                  >
                    {contactDrawerContent.closeButtonLabel}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="client-name"
                      className="block font-mono text-[11px] tracking-wider uppercase text-[#555650] mb-2"
                    >
                      {contactDrawerContent.nameLabel}
                    </label>
                    <input
                      id="client-name"
                      required
                      type="text"
                      placeholder={contactDrawerContent.namePlaceholder}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#F1EEE7] border border-[#D8D4CA] px-4 py-3 text-sm text-[#171817] placeholder:text-[#555650]/60 focus:bg-[#FCFBF7] focus:border-[#171817] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="client-contact"
                      className="block font-mono text-[11px] tracking-wider uppercase text-[#555650] mb-2"
                    >
                      {contactDrawerContent.contactLabel}
                    </label>
                    <input
                      id="client-contact"
                      required
                      type="text"
                      placeholder={contactDrawerContent.contactPlaceholder}
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      className="w-full bg-[#F1EEE7] border border-[#D8D4CA] px-4 py-3 text-sm text-[#171817] placeholder:text-[#555650]/60 focus:bg-[#FCFBF7] focus:border-[#171817] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="practice-select"
                      className="block font-mono text-[11px] tracking-wider uppercase text-[#555650] mb-2"
                    >
                      {contactDrawerContent.concernLabel}
                    </label>
                    <select
                      id="practice-select"
                      value={formData.practiceArea}
                      onChange={(e) =>
                        setFormData({ ...formData, practiceArea: e.target.value })
                      }
                      className="w-full bg-[#F1EEE7] border border-[#D8D4CA] px-4 py-3 text-sm text-[#171817] focus:bg-[#FCFBF7] focus:border-[#171817] focus:outline-none transition-colors"
                    >
                      {contactDrawerContent.practiceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="client-narrative"
                      className="block font-mono text-[11px] tracking-wider uppercase text-[#555650] mb-2 flex justify-between"
                    >
                      <span>{contactDrawerContent.narrativeLabel}</span>
                      <span className="text-[#9C3C35] normal-case italic font-serif">
                        {contactDrawerContent.narrativeHelp}
                      </span>
                    </label>
                    <textarea
                      id="client-narrative"
                      rows={4}
                      required
                      placeholder={contactDrawerContent.narrativePlaceholder}
                      value={formData.narrative}
                      onChange={(e) =>
                        setFormData({ ...formData, narrative: e.target.value })
                      }
                      className="w-full bg-[#F1EEE7] border border-[#D8D4CA] px-4 py-3 text-sm text-[#171817] placeholder:text-[#555650]/60 focus:bg-[#FCFBF7] focus:border-[#171817] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#171817] text-[#FCFBF7] hover:bg-[#9C3C35] transition-colors font-mono text-xs uppercase tracking-widest font-medium group"
                    >
                      <span>{contactDrawerContent.submitButtonLabel}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="font-sans text-[11px] text-[#555650] text-center mt-3">
                      {contactDrawerContent.disclaimer}
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Coordinates */}
            <div className="p-8 md:p-10 border-t border-[#171817]/10 bg-[#F1EEE7] font-mono text-xs text-[#555650] flex flex-col md:flex-row justify-between gap-4">
              <div>
                <span className="block text-[#171817] font-medium uppercase tracking-wider text-[10px]">
                  {contactDrawerContent.directChambersLabel}
                </span>
                <span className="text-sm font-semibold text-[#171817]">
                  {FIRM_INFO.phone}
                </span>
              </div>
              <div>
                <span className="block text-[#171817] font-medium uppercase tracking-wider text-[10px]">
                  {contactDrawerContent.addressLabel}
                </span>
                <span>{FIRM_INFO.address}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
