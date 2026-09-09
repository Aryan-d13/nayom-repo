"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { visitModalContent } from "@/data/content";

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: string;
}

export default function VisitModal({
  isOpen,
  onClose,
  defaultAction = "visit",
}: VisitModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultAction);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    studentAgeGrade: visitModalContent.gradeOptions[2].value as string,
    preferredDate: "Tuesday Morning Campus Walk",
    notes: "",
  });

  useEffect(() => {
    setActiveTab(defaultAction);
    setSubmitted(false);
  }, [defaultAction, isOpen]);

  // Handle escape key
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
    setSubmitted(true);
  };

  const currentTabConfig = visitModalContent.tabs.find((t) => t.id === activeTab) || visitModalContent.tabs[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#20231F]/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#20231F]/10 text-[#20231F] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F5F1E8] hover:bg-[#20231F] hover:text-[#FFFDF8] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#D76C56]">
                {visitModalContent.badge}
              </span>
              <h3
                id="modal-title"
                className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#20231F] mt-1"
              >
                {currentTabConfig.title}
              </h3>
              <p className="text-sm text-[#20231F]/75 mt-2">
                {visitModalContent.subheading}
              </p>
            </div>

            {/* Action Tabs */}
            <div className="flex gap-2 p-1.5 bg-[#F5F1E8] rounded-xl mb-6">
              {visitModalContent.tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSubmitted(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#20231F] text-[#FFFDF8] shadow-xs"
                      : "text-[#20231F]/70 hover:text-[#20231F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form or Confirmation */}
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-[#73866C] mb-4" />
                <h4 className="text-2xl font-bold uppercase tracking-tight">
                  {visitModalContent.success.title}
                </h4>
                <p className="text-sm text-[#20231F]/80 max-w-md mt-2 leading-relaxed">
                  {visitModalContent.success.message}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 px-6 py-2.5 bg-[#20231F] text-[#FFFDF8] text-xs uppercase font-bold tracking-widest rounded-full hover:bg-[#D76C56] transition-colors cursor-pointer"
                >
                  {visitModalContent.success.closeButton}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="parentName"
                      className="block text-xs font-bold uppercase tracking-wider text-[#20231F]/80 mb-1"
                    >
                      {visitModalContent.labels.parentName}
                    </label>
                    <input
                      id="parentName"
                      type="text"
                      required
                      placeholder={visitModalContent.labels.parentPlaceholder}
                      value={formData.parentName}
                      onChange={(e) =>
                        setFormData({ ...formData, parentName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#20231F]/20 bg-white text-sm focus:border-[#20231F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider text-[#20231F]/80 mb-1"
                    >
                      {visitModalContent.labels.email}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder={visitModalContent.labels.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#20231F]/20 bg-white text-sm focus:border-[#20231F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-xs font-bold uppercase tracking-wider text-[#20231F]/80 mb-1"
                    >
                      {visitModalContent.labels.gradeLevel}
                    </label>
                    <select
                      id="grade"
                      value={formData.studentAgeGrade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentAgeGrade: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#20231F]/20 bg-white text-sm focus:border-[#20231F] focus:outline-none"
                    >
                      {visitModalContent.gradeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold uppercase tracking-wider text-[#20231F]/80 mb-1"
                    >
                      {visitModalContent.labels.phone}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder={visitModalContent.labels.phonePlaceholder}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#20231F]/20 bg-white text-sm focus:border-[#20231F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-xs font-bold uppercase tracking-wider text-[#20231F]/80 mb-1"
                  >
                    {visitModalContent.labels.notes}
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder={visitModalContent.labels.notesPlaceholder}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#20231F]/20 bg-white text-sm focus:border-[#20231F] focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#20231F]/60 font-mono">
                    {visitModalContent.labels.directCall}
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#D76C56] hover:bg-[#20231F] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
                  >
                    {currentTabConfig.buttonText}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
