"use client";

import React, { createContext, useContext, useState } from "react";

type Tone = "paper" | "warm" | "cool" | "mist" | "white";

interface AirContextType {
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  bookingService: string;
  setBookingService: (service: string) => void;
  activeTone: Tone;
  setActiveTone: (tone: Tone) => void;
}

const AirContext = createContext<AirContextType | undefined>(undefined);

export function AirProvider({ children }: { children: React.ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState("General Visit");
  const [activeTone, setActiveTone] = useState<Tone>("paper");

  return (
    <AirContext.Provider
      value={{
        isBookingOpen,
        setIsBookingOpen,
        bookingService,
        setBookingService,
        activeTone,
        setActiveTone,
      }}
    >
      {children}
    </AirContext.Provider>
  );
}

export function useAir() {
  const context = useContext(AirContext);
  if (!context) {
    throw new Error("useAir must be used within an AirProvider");
  }
  return context;
}
