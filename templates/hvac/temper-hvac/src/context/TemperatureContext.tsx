"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TemperatureContextType {
  temperature: number;
  conditionName: string;
  setTemperatureState: (temp: number, conditionName?: string) => void;
  isBookingOpen: boolean;
  selectedIssue: string;
  openBooking: (issue?: string) => void;
  closeBooking: () => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: { children: ReactNode }) {
  const [temperature, setTemperature] = useState<number>(72);
  const [conditionName, setConditionName] = useState<string>("BALANCED");
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<string>("");

  const setTemperatureState = useCallback((temp: number, condition?: string) => {
    setTemperature(temp);
    if (condition) setConditionName(condition);
  }, []);

  const openBooking = useCallback((issue?: string) => {
    if (issue) setSelectedIssue(issue);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  return (
    <TemperatureContext.Provider
      value={{
        temperature,
        conditionName,
        setTemperatureState,
        isBookingOpen,
        selectedIssue,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error("useTemperature must be used within a TemperatureProvider");
  }
  return context;
}
