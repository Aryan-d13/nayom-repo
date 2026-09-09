"use client";

import React from "react";

interface MarginNoteProps {
  folio?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  tone?: "ink" | "dark" | "red";
}

export function MarginNote({
  folio,
  label,
  children,
  className = "",
  tone = "ink",
}: MarginNoteProps) {
  const textColor =
    tone === "dark"
      ? "text-[#FCFBF7]/60 border-[#FCFBF7]/20"
      : tone === "red"
      ? "text-[#9C3C35] border-[#9C3C35]/30"
      : "text-[#555650] border-[#171817]/15";

  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-widest leading-relaxed border-l pl-2.5 ${textColor} ${className}`}
    >
      {folio && <span className="block font-semibold">{folio}</span>}
      {label && <span className="block text-[10px] opacity-80">{label}</span>}
      {children}
    </div>
  );
}
