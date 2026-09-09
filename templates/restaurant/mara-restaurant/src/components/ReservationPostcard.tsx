"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { reservationContent, businessInfo } from "@/data/content";

export default function ReservationPostcard() {
  const [partySize, setPartySize] = useState<string>(reservationContent.partyOptions[1]);
  const [date, setDate] = useState<string>(reservationContent.dateOptions[0]);
  const [time, setTime] = useState<string>(reservationContent.timeOptions[3]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const code = "MARA-" + Math.floor(1000 + Math.random() * 9000);
    setConfirmationCode(code);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setNotes("");
  };

  return (
    <section
      id="reservation-section"
      className="py-20 md:py-28 bg-[#C75037] text-[#FFFDF8] relative overflow-hidden"
    >
      {/* Postal Cancellation Stamp Watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none font-serif text-[220px] font-bold tracking-tighter text-[#FFFDF8] leading-none">
        POST
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header in Soft White on Tomato */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A93E27] rounded-full text-xs font-semibold uppercase tracking-widest text-[#FAF6EE] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7C85A]" />
            <span>{reservationContent.badge}</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-tight">
            {reservationContent.title}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#FAF6EE]/90 mt-2">
            {reservationContent.subtitle}
          </p>
        </div>

        {/* The Postcard Frame */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FAF6EE] text-[#20201D] p-6 sm:p-10 md:p-12 shadow-2xl border-4 border-[#FFFDF8] relative"
              >
                {/* Simulated Postage Stamp top right */}
                <div className="absolute top-6 right-6 hidden sm:flex flex-col items-center justify-center w-20 h-24 border-2 border-dashed border-[#C75037] p-2 bg-[#FFFDF8] rotate-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#C75037]">{businessInfo.name}</span>
                  <span className="font-serif text-xs font-bold text-[#20201D] my-1">USA</span>
                  <span className="text-[8px] text-[#68655E]">BROOKLYN</span>
                </div>

                <div className="border-b border-dashed border-[#DDD1BB] pb-4 mb-8">
                  <span className="font-serif text-xs uppercase tracking-widest text-[#687052] font-semibold">
                    {reservationContent.postcardHeader}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#20201D] mt-1">
                    {reservationContent.postcardTitle}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Party Size, Date, Time Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Party Size */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#C75037]" />
                        <span>{reservationContent.partyLabel}</span>
                      </label>
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(e.target.value)}
                        className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm font-serif font-bold text-[#20201D] focus:outline-none focus:border-[#C75037] rounded-xs cursor-pointer"
                      >
                        {reservationContent.partyOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C75037]" />
                        <span>{reservationContent.dateLabel}</span>
                      </label>
                      <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm font-serif font-bold text-[#20201D] focus:outline-none focus:border-[#C75037] rounded-xs cursor-pointer"
                      >
                        {reservationContent.dateOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C75037]" />
                        <span>{reservationContent.timeLabel}</span>
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm font-serif font-bold text-[#20201D] focus:outline-none focus:border-[#C75037] rounded-xs cursor-pointer"
                      >
                        {reservationContent.timeOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2">
                        {reservationContent.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={reservationContent.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm text-[#20201D] placeholder:text-[#9B978F] focus:outline-none focus:border-[#C75037] rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2">
                        {reservationContent.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={reservationContent.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm text-[#20201D] placeholder:text-[#9B978F] focus:outline-none focus:border-[#C75037] rounded-xs"
                      />
                    </div>
                  </div>

                  {/* Dietary notes / Special occasions */}
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#68655E] mb-2">
                      {reservationContent.notesLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={reservationContent.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#F2EADB] border border-[#DDD1BB] px-3.5 py-3 text-sm text-[#20201D] placeholder:text-[#9B978F] focus:outline-none focus:border-[#C75037] rounded-xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#C75037] hover:bg-[#A93E27] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>{reservationContent.submitButton}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#68655E] text-center italic">
                    {reservationContent.finePrint}
                  </p>
                </form>
              </motion.div>
            ) : (
              /* Confirmation Postcard */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FAF6EE] text-[#20201D] p-8 sm:p-12 shadow-2xl border-4 border-[#FFFDF8] text-center relative"
              >
                {/* Stamp graphic */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#687052]/15 text-[#687052] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="text-xs uppercase font-bold tracking-widest text-[#C75037] mb-2">
                  CONFIRMATION CODE: {confirmationCode}
                </div>

                <h3 className="font-serif text-4xl sm:text-5xl font-bold text-[#20201D] mb-4">
                  {reservationContent.confirmationTitle}
                </h3>

                <p className="font-serif italic text-xl text-[#68655E] max-w-lg mx-auto mb-6">
                  {reservationContent.confirmationGreeting}, {name}.
                </p>

                {/* Booking summary box */}
                <div className="bg-[#F2EADB] border border-[#DDD1BB] p-6 max-w-md mx-auto mb-8 text-left divide-y divide-[#DDD1BB]">
                  <div className="py-2 flex justify-between text-sm">
                    <span className="text-[#68655E]">Party Size:</span>
                    <span className="font-serif font-bold text-[#20201D]">{partySize}</span>
                  </div>
                  <div className="py-2 flex justify-between text-sm">
                    <span className="text-[#68655E]">Requested Time:</span>
                    <span className="font-serif font-bold text-[#20201D]">{date} at {time}</span>
                  </div>
                  <div className="py-2 flex justify-between text-sm">
                    <span className="text-[#68655E]">Location:</span>
                    <span className="font-serif font-bold text-[#20201D]">{businessInfo.address}</span>
                  </div>
                  {notes && (
                    <div className="py-2 flex justify-between text-sm">
                      <span className="text-[#68655E]">Notes:</span>
                      <span className="italic text-[#20201D]">{notes}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#68655E] max-w-sm mx-auto mb-8">
                  {reservationContent.confirmationNotice} <strong>{email}</strong>. If your schedule shifts, simply reply to the note or give us a call at {businessInfo.phone}.
                </p>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-[#20201D] text-[#20201D] hover:bg-[#20201D] hover:text-[#FFFDF8] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer rounded-xs"
                >
                  {reservationContent.resetButton}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
