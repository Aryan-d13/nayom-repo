"use client";

import { useState } from "react";
import { ArrowRight, Phone, MapPin, CheckCircle2, Clock } from "lucide-react";
import { bookingContent, businessInfo } from "@/data/content";

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    issue: "",
    preferredDay: "Tomorrow",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.phone.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="booking"
      className="relative bg-paper text-asphalt py-24 sm:py-36 border-b border-black/10 paper-texture select-none"
      aria-labelledby="booking-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Call-to-Action */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-asphalt/60">
              <span className="w-2 h-2 bg-signal-red" />
              <span>{bookingContent.badge}</span>
            </div>

            <div className="space-y-2">
              <h2
                id="booking-title"
                className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-asphalt leading-none"
              >
                {bookingContent.headline}
              </h2>
              <div className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-signal-red">
                {bookingContent.headlineRed}
              </div>
            </div>

            <p className="font-sans text-base sm:text-lg text-asphalt/85 max-w-md font-normal leading-relaxed">
              {bookingContent.description}
            </p>

            {/* Direct Shop Contact Details */}
            <div className="pt-6 border-t border-asphalt/20 space-y-4 font-mono text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-asphalt text-road-white flex items-center justify-center">
                  <Phone className="w-4 h-4 text-signal-red" />
                </div>
                <div>
                  <span className="text-xs uppercase text-asphalt/60 block">{bookingContent.callLabel}</span>
                  <a
                    href={businessInfo.phoneRaw}
                    className="font-bold text-asphalt hover:text-signal-red transition-colors text-base"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-asphalt text-road-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-signal-red" />
                </div>
                <div>
                  <span className="text-xs uppercase text-asphalt/60 block">{bookingContent.addressLabel}</span>
                  <span className="font-semibold text-asphalt">
                    {businessInfo.fullAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-asphalt text-road-white flex items-center justify-center">
                  <Clock className="w-4 h-4 text-signal-red" />
                </div>
                <div>
                  <span className="text-xs uppercase text-asphalt/60 block">{bookingContent.hoursLabel}</span>
                  <span className="font-medium text-asphalt">
                    {businessInfo.hours.weekdays} &nbsp;|&nbsp; {businessInfo.hours.saturday}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Very Simple Booking Form or Confirmation */}
          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-asphalt p-6 sm:p-10 shadow-2xl relative">
              {/* Form header tab */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-asphalt/15 font-mono text-xs uppercase tracking-wider text-asphalt/70">
                <span>{bookingContent.ticketLabel}</span>
                <span className="text-signal-red font-bold">{bookingContent.shopBrand}</span>
              </div>

              {submitted ? (
                /* Post-Submission State */
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 border border-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-3xl font-black uppercase tracking-tight text-asphalt">
                    {bookingContent.submitSuccess.title}
                  </h3>
                  <p className="font-sans text-base text-asphalt/85 max-w-sm mx-auto">
                    {bookingContent.submitSuccess.message}
                  </p>
                  <p className="font-mono text-xs text-asphalt/60 pt-4">
                    {bookingContent.submitSuccess.urgentNote}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        issue: "",
                        preferredDay: "Tomorrow",
                      });
                    }}
                    className="mt-6 font-mono text-xs uppercase tracking-wider text-asphalt underline hover:text-signal-red"
                  >
                    {bookingContent.submitSuccess.resetButton}
                  </button>
                </div>
              ) : (
                /* Simple Booking Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block font-mono text-xs uppercase tracking-wider text-asphalt font-bold mb-1.5"
                    >
                      {bookingContent.form.nameLabel} <span className="text-signal-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="booking-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={bookingContent.form.namePlaceholder}
                      className="w-full px-4 py-3 bg-paper/50 border border-asphalt/30 text-asphalt font-sans text-sm focus:outline-none focus:ring-2 focus:ring-signal-red focus:bg-white placeholder:text-asphalt/40"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block font-mono text-xs uppercase tracking-wider text-asphalt font-bold mb-1.5"
                    >
                      {bookingContent.form.phoneLabel} <span className="text-signal-red">*</span>
                    </label>
                    <input
                      type="tel"
                      id="booking-phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={bookingContent.form.phonePlaceholder}
                      className="w-full px-4 py-3 bg-paper/50 border border-asphalt/30 text-asphalt font-sans text-sm focus:outline-none focus:ring-2 focus:ring-signal-red focus:bg-white placeholder:text-asphalt/40"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-issue"
                      className="block font-mono text-xs uppercase tracking-wider text-asphalt font-bold mb-1.5"
                    >
                      {bookingContent.form.issueLabel}
                    </label>
                    <textarea
                      id="booking-issue"
                      rows={3}
                      value={formData.issue}
                      onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                      placeholder={bookingContent.form.issuePlaceholder}
                      className="w-full px-4 py-3 bg-paper/50 border border-asphalt/30 text-asphalt font-sans text-sm focus:outline-none focus:ring-2 focus:ring-signal-red focus:bg-white placeholder:text-asphalt/40 resize-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-day"
                      className="block font-mono text-xs uppercase tracking-wider text-asphalt font-bold mb-1.5"
                    >
                      {bookingContent.form.dayLabel}
                    </label>
                    <select
                      id="booking-day"
                      value={formData.preferredDay}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredDay: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-paper/50 border border-asphalt/30 text-asphalt font-sans text-sm focus:outline-none focus:ring-2 focus:ring-signal-red focus:bg-white"
                    >
                      {bookingContent.form.dayOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-asphalt hover:bg-black text-road-white font-display font-bold uppercase tracking-wider text-sm transition-all duration-150 flex items-center justify-center gap-3 border border-asphalt active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-signal-red cursor-pointer"
                  >
                    <span>{bookingContent.form.submitText}</span>
                    <ArrowRight className="w-4 h-4 text-signal-red" />
                  </button>

                  <p className="text-[11px] font-mono text-asphalt/60 text-center">
                    {bookingContent.form.footerDisclaimer}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
