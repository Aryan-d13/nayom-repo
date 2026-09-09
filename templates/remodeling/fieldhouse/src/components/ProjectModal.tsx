"use client";

import { useState, useEffect } from "react";
import { X, Phone, Check } from "lucide-react";
import { BRAND, PROJECT_MODAL_CONTENT } from "@/data/content";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhood: "",
    houseEra: PROJECT_MODAL_CONTENT.fields.houseEraOptions[0],
    room: PROJECT_MODAL_CONTENT.fields.roomOptions[0],
    notes: "",
  });

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/80 backdrop-blur-sm animate-fadeIn overscroll-contain"
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div
          data-lenis-prevent
          className="relative w-full max-w-2xl bg-warm-white border border-dust p-6 sm:p-10 shadow-2xl my-8 overflow-y-auto max-h-[85vh] overscroll-contain focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-ink/70 hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          aria-label="Close project planning modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-moss/20 text-moss flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl text-ink">{PROJECT_MODAL_CONTENT.success.title}</h3>
            <p className="text-sm text-ink/75 max-w-md mx-auto leading-relaxed">
              {PROJECT_MODAL_CONTENT.success.message}
            </p>
            <div className="pt-6">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 bg-ink text-warm-white text-xs uppercase tracking-wider font-medium"
              >
                {PROJECT_MODAL_CONTENT.success.closeButton}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-moss block mb-2">
                {PROJECT_MODAL_CONTENT.studioTag}
              </span>
              <h3
                id="project-modal-title"
                className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight"
              >
                {PROJECT_MODAL_CONTENT.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink/70 mt-2">
                {PROJECT_MODAL_CONTENT.description}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta"
                    placeholder={PROJECT_MODAL_CONTENT.fields.namePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta"
                    placeholder={PROJECT_MODAL_CONTENT.fields.phonePlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta"
                    placeholder={PROJECT_MODAL_CONTENT.fields.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.neighborhoodLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta"
                    placeholder={PROJECT_MODAL_CONTENT.fields.neighborhoodPlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.houseEraLabel}
                  </label>
                  <select
                    value={formData.houseEra}
                    onChange={(e) => setFormData({ ...formData, houseEra: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta cursor-pointer"
                  >
                    {PROJECT_MODAL_CONTENT.fields.houseEraOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                    {PROJECT_MODAL_CONTENT.fields.roomLabel}
                  </label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta cursor-pointer"
                  >
                    {PROJECT_MODAL_CONTENT.fields.roomOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-ink/80 mb-2">
                  {PROJECT_MODAL_CONTENT.fields.notesLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-parchment/40 border border-dust text-sm text-ink focus:outline-none focus:border-terracotta"
                  placeholder={PROJECT_MODAL_CONTENT.fields.notesPlaceholder}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-dust/60 gap-4">
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="flex items-center text-xs text-ink/75 hover:text-ink font-mono"
                >
                  <Phone className="w-3.5 h-3.5 mr-2 text-moss" />
                  <span>
                    {PROJECT_MODAL_CONTENT.callDirectPrefix} {BRAND.phone}
                  </span>
                </a>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-ink text-warm-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-moss transition-colors cursor-pointer"
                >
                  {PROJECT_MODAL_CONTENT.submitButton}
                </button>
              </div>
            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
