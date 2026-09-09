"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Phone, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { bookingDrawerContent, businessInfo } from "@/data/content";

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export default function BookingDrawer({
  isOpen,
  onClose,
  preselectedService = bookingDrawerContent.services[0],
}: BookingDrawerProps) {
  const [service, setService] = useState(preselectedService);
  const [city, setCity] = useState(bookingDrawerContent.cities[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const serviceOptions = bookingDrawerContent.services;
  const cityOptions = bookingDrawerContent.cities;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#000000]/70 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over Drawer */}
      <div className="relative z-10 w-full max-w-lg bg-[#F3F0E8] text-[#11110F] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 sm:p-8 border-b border-[#E2DDD2] flex items-start justify-between bg-[#ECE7DC]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BDF45B]" />
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#66665E]">
                {bookingDrawerContent.eyebrow}
              </span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-[#11110F]">
              {bookingDrawerContent.title}
            </h3>
            <p className="text-xs text-[#66665E] mt-1">
              {bookingDrawerContent.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#66665E] hover:text-[#11110F] transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 sm:p-8 flex-grow">
          {submitted ? (
            <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-[#11110F] text-[#BDF45B] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-semibold tracking-tight text-[#11110F]">
                {bookingDrawerContent.success.title}
              </h4>
              <p className="text-sm text-[#55554D] max-w-xs mx-auto leading-relaxed">
                {bookingDrawerContent.success.textPrefix}{name || bookingDrawerContent.success.textDefaultName}{bookingDrawerContent.success.textMiddle}
                <strong className="text-[#11110F]">{bookingDrawerContent.success.phone}</strong>{bookingDrawerContent.success.textSuffix}
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#11110F] text-[#FFFFFF] text-xs uppercase tracking-wider font-semibold hover:bg-[#252522] transition-colors"
                >
                  {bookingDrawerContent.success.doneText}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A42] mb-1.5">
                  {bookingDrawerContent.serviceLabel}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5CFC1] text-sm text-[#11110F] focus:outline-none focus:border-[#11110F] transition-colors"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A42] mb-1.5">
                  {bookingDrawerContent.cityLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cityOptions.slice(0, 4).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCity(c)}
                      className={`px-3 py-2 text-xs font-medium border text-left transition-colors ${
                        city === c
                          ? "bg-[#11110F] text-[#FFFFFF] border-[#11110F]"
                          : "bg-[#FFFFFF] text-[#4A4A42] border-[#D5CFC1] hover:border-[#11110F]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A42] mb-1.5">
                    {bookingDrawerContent.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={bookingDrawerContent.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5CFC1] text-sm text-[#11110F] focus:outline-none focus:border-[#11110F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A42] mb-1.5">
                    {bookingDrawerContent.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={bookingDrawerContent.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5CFC1] text-sm text-[#11110F] focus:outline-none focus:border-[#11110F]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A42] mb-1.5">
                  {bookingDrawerContent.notesLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={bookingDrawerContent.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5CFC1] text-sm text-[#11110F] focus:outline-none focus:border-[#11110F]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="cta-sweep w-full py-3.5 bg-[#11110F] text-[#FFFFFF] text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#252522] transition-colors"
              >
                <span>{bookingDrawerContent.submitText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Direct Call Alternative */}
          <div className="mt-8 pt-6 border-t border-[#E2DDD2] flex items-center justify-between text-xs text-[#66665E]">
            <span>{bookingDrawerContent.directCallQuestion}</span>
            <a
              href={businessInfo.phoneTel}
              className="font-semibold text-[#11110F] flex items-center gap-1.5 hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-[#BDF45B]" />
              <span>{bookingDrawerContent.directCallPhone}</span>
            </a>
          </div>
        </div>

        {/* Footer Guarantees */}
        <div className="p-4 sm:p-6 bg-[#ECE7DC] border-t border-[#E2DDD2] flex items-center justify-around text-[11px] text-[#55554D]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#11110F]" />
            {bookingDrawerContent.guaranteeCommunication}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#11110F]" />
            {bookingDrawerContent.guaranteeLicensed}
          </span>
        </div>
      </div>
    </div>
  );
}
