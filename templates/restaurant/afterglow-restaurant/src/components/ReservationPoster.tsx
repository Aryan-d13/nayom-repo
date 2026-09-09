"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { reservationContent } from "@/data/content";

export default function ReservationPoster() {
  const [formData, setFormData] = useState({
    date: reservationContent.form.dateOptions[0].value as string,
    time: "20:00",
    guests: reservationContent.form.guestsOptions[1].value as string,
    name: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg(reservationContent.form.errorRequired);
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    // Simulate authentic booking confirmation transformation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      date: reservationContent.form.dateOptions[0].value as string,
      time: "20:00",
      guests: reservationContent.form.guestsOptions[1].value as string,
      name: "",
      email: "",
    });
  };

  return (
    <section
      id="reservation"
      className="relative min-h-screen w-full bg-[#E9E2D4] text-[#171514] paper-grain py-24 sm:py-32 px-4 sm:px-8 md:px-12 flex items-center justify-center border-t border-[#171514]/15"
    >
      {/* Giant Printed Poster Container */}
      <div className="relative w-full max-w-4xl bg-[#F7F2E8] border-2 border-[#171514] p-6 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
        {/* Poster Corner Stamp Marks */}
        <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-[#702F35] uppercase">
          {reservationContent.stamps.topLeft}
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono tracking-widest text-[#171514]/50 uppercase">
          {reservationContent.stamps.topRight}
        </div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono tracking-widest text-[#171514]/40 uppercase">
          {reservationContent.stamps.bottomLeft}
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest text-[#702F35] uppercase">
          {reservationContent.stamps.bottomRight}
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* PRE-SUBMISSION POSTER STATE */
            <motion.div
              key="form-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Giant Poster Headline */}
              <div className="border-b-2 border-[#171514] pb-6 sm:pb-8 mb-8 sm:mb-12">
                <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#702F35] block mb-1">
                  {reservationContent.header.eyebrow}
                </span>
                <h2 className="text-6xl sm:text-8xl md:text-9xl font-sans font-black tracking-tight uppercase leading-[0.85] text-[#171514]">
                  {reservationContent.header.heading}
                </h2>
                <div className="mt-3 flex items-baseline justify-between font-mono text-sm sm:text-base tracking-[0.2em] text-[#171514]/75 uppercase">
                  <span>{reservationContent.header.locationLeft}</span>
                  <span className="text-[#702F35] font-bold">{reservationContent.header.locationRight}</span>
                </div>
              </div>

              {/* Visually simple reservation form */}
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Top Row: DATE / TIME / GUESTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-b border-[#171514]/20 pb-6 sm:pb-8">
                  {/* Date Selection */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="res-date"
                      className="text-xs font-mono tracking-[0.2em] uppercase text-[#702F35] font-bold mb-2"
                    >
                      {reservationContent.form.dateLabel}
                    </label>
                    <select
                      id="res-date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="bg-[#E9E2D4] border border-[#171514] p-3 text-sm font-mono uppercase text-[#171514] focus:outline-none focus:ring-2 focus:ring-[#702F35] cursor-pointer"
                    >
                      {reservationContent.form.dateOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="res-time"
                      className="text-xs font-mono tracking-[0.2em] uppercase text-[#702F35] font-bold mb-2"
                    >
                      {reservationContent.form.timeLabel}
                    </label>
                    <select
                      id="res-time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="bg-[#E9E2D4] border border-[#171514] p-3 text-sm font-mono uppercase text-[#171514] focus:outline-none focus:ring-2 focus:ring-[#702F35] cursor-pointer"
                    >
                      {reservationContent.form.timeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests Selection */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="res-guests"
                      className="text-xs font-mono tracking-[0.2em] uppercase text-[#702F35] font-bold mb-2"
                    >
                      {reservationContent.form.guestsLabel}
                    </label>
                    <select
                      id="res-guests"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="bg-[#E9E2D4] border border-[#171514] p-3 text-sm font-mono uppercase text-[#171514] focus:outline-none focus:ring-2 focus:ring-[#702F35] cursor-pointer"
                    >
                      {reservationContent.form.guestsOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bottom Row: NAME / EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="res-name"
                      className="text-xs font-mono tracking-[0.2em] uppercase text-[#702F35] font-bold mb-2"
                    >
                      {reservationContent.form.nameLabel}
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      placeholder={reservationContent.form.namePlaceholder}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-[#E9E2D4] border border-[#171514] p-3 text-sm font-mono text-[#171514] placeholder:text-[#171514]/40 focus:outline-none focus:ring-2 focus:ring-[#702F35]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="res-email"
                      className="text-xs font-mono tracking-[0.2em] uppercase text-[#702F35] font-bold mb-2"
                    >
                      {reservationContent.form.emailLabel}
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      placeholder={reservationContent.form.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-[#E9E2D4] border border-[#171514] p-3 text-sm font-mono text-[#171514] placeholder:text-[#171514]/40 focus:outline-none focus:ring-2 focus:ring-[#702F35]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-mono text-[#702F35] tracking-wide">
                    {errorMsg}
                  </p>
                )}

                {/* Primary Button: REQUEST A TABLE */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#702F35] hover:bg-[#86373e] text-[#F7F2E8] font-sans font-bold text-sm sm:text-base tracking-[0.2em] uppercase px-8 py-4 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? reservationContent.form.submitPending : reservationContent.form.submitIdle}
                  </button>
                  <p className="text-xs font-mono tracking-widest text-[#171514]/60 uppercase text-center sm:text-right">
                    {reservationContent.form.footerNotice}
                  </p>
                </div>
              </form>
            </motion.div>
          ) : (
            /* POST-SUBMISSION REARRANGED POSTER STATE */
            <motion.div
              key="confirmed-state"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full py-6 text-left"
            >
              {/* The rearranged poster typography */}
              <div className="border-b-2 border-[#171514] pb-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <h2 className="text-6xl sm:text-8xl md:text-9xl font-sans font-black tracking-tight leading-[0.85] text-[#171514] uppercase whitespace-pre-line">
                    {reservationContent.confirmed.heading}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-6"
                >
                  <p className="text-4xl sm:text-6xl md:text-7xl font-serif italic text-[#702F35] tracking-tight">
                    {reservationContent.confirmed.subheading}
                  </p>
                </motion.div>
              </div>

              {/* Confirmation Details Card within poster */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#E9E2D4] p-6 border border-[#171514] text-xs font-mono uppercase tracking-[0.16em]"
              >
                <div>
                  <span className="text-[#702F35] font-bold block mb-1">{reservationContent.confirmed.guestLabel}</span>
                  <span className="text-sm font-sans font-semibold text-[#171514]">
                    {formData.name}
                  </span>
                  <span className="block text-[#171514]/60 text-[11px]">
                    {formData.email}
                  </span>
                </div>

                <div>
                  <span className="text-[#702F35] font-bold block mb-1">{reservationContent.confirmed.bookingLabel}</span>
                  <span className="text-sm font-sans font-semibold text-[#171514]">
                    {formData.date} at {formData.time}
                  </span>
                  <span className="block text-[#171514]/60 text-[11px]">
                    {formData.guests} {reservationContent.confirmed.diningNote}
                  </span>
                </div>
              </motion.div>

              {/* Poster Signoff as specified */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between border-t border-[#171514]/20 pt-6 gap-4"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-sans font-bold tracking-tight uppercase text-[#171514]">
                    {reservationContent.confirmed.brand}
                  </div>
                  <div className="font-mono text-xs tracking-[0.2em] text-[#702F35] uppercase mt-1">
                    {reservationContent.confirmed.address}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-mono tracking-widest text-[#171514]/60 underline hover:text-[#702F35] transition-colors uppercase cursor-pointer"
                >
                  {reservationContent.confirmed.resetLabel}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
