"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, projectModalContent } from "@/data/content";
import { X, Check, ArrowRight, Phone } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function ProjectModal({
  isOpen,
  onClose,
  initialService = "Kitchen",
}: ProjectModalProps) {
  const [selectedService, setSelectedService] = useState(
    initialService || projectModalContent.services[0]
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhood: projectModalContent.neighborhoods[0],
    timeline: "3–6 months",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-chalk rounded-xs border border-stone shadow-2xl p-8 md:p-10 my-8 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-ink/60 hover:text-ink transition-colors cursor-pointer rounded-xs"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif italic text-3xl text-ink">
                  {projectModalContent.successTitle}
                </h3>
                <p className="font-sans text-sm text-ink/70 max-w-md mx-auto leading-relaxed">
                  {projectModalContent.successMessage}
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      onClose();
                    }}
                    className="px-6 py-3 bg-ink text-chalk text-xs tracking-widest uppercase hover:bg-terracotta transition-colors"
                  >
                    {projectModalContent.closeButtonLabel}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-8">
                  <span className="font-mono text-xs tracking-[0.24em] text-terracotta uppercase">
                    {projectModalContent.tag}
                  </span>
                  <h3 className="font-sans font-medium text-2xl sm:text-3xl text-ink uppercase tracking-tight mt-1">
                    {projectModalContent.title}
                  </h3>
                  <p className="font-serif italic text-base text-ink/70 mt-1">
                    {projectModalContent.subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service selector chips */}
                  <div>
                    <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-2">
                      {projectModalContent.servicesLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {projectModalContent.services.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setSelectedService(svc)}
                          className={`px-3 py-1.5 text-xs font-sans tracking-wide rounded-xs transition-colors cursor-pointer ${
                            selectedService === svc
                              ? "bg-ink text-chalk"
                              : "bg-stone/40 hover:bg-stone/70 text-ink"
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two column fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-1">
                        {projectModalContent.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={projectModalContent.namePlaceholder}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-stone/80 text-ink text-sm rounded-xs focus:outline-hidden focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-1">
                        {projectModalContent.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={projectModalContent.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-stone/80 text-ink text-sm rounded-xs focus:outline-hidden focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-1">
                        {projectModalContent.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={projectModalContent.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-stone/80 text-ink text-sm rounded-xs focus:outline-hidden focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-1">
                        {projectModalContent.neighborhoodLabel}
                      </label>
                      <select
                        value={formData.neighborhood}
                        onChange={(e) =>
                          setFormData({ ...formData, neighborhood: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-stone/80 text-ink text-sm rounded-xs focus:outline-hidden focus:border-terracotta"
                      >
                        {projectModalContent.neighborhoods.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block font-mono text-[11px] text-ink/60 tracking-wider uppercase mb-1">
                      {projectModalContent.notesLabel}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={projectModalContent.notesPlaceholder}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-white border border-stone/80 text-ink text-sm rounded-xs focus:outline-hidden focus:border-terracotta resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-ink text-chalk text-xs tracking-[0.18em] uppercase font-sans flex items-center justify-center gap-2 hover:bg-terracotta transition-colors rounded-xs cursor-pointer"
                    >
                      <span>{projectModalContent.submitLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 text-xs font-mono text-ink/60">
                      <Phone className="w-3.5 h-3.5 text-terracotta" />
                      <span>
                        {projectModalContent.callAlternativePrefix} {BRAND.phone}
                      </span>
                    </div>
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
