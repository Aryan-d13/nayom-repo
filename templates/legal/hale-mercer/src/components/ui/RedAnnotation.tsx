"use client";

import React from "react";
import { motion } from "framer-motion";

interface UnderlineProps {
  className?: string;
  delay?: number;
  width?: string | number;
}

export function RedUnderline({
  className = "",
  delay = 0.2,
  width = "100%",
}: UnderlineProps) {
  return (
    <svg
      className={`overflow-visible pointer-events-none ${className}`}
      width={width}
      height="12"
      viewBox="0 0 300 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M2.5 7.5C65.5 3.5 185 2 297.5 8"
        stroke="#9C3C35"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </svg>
  );
}

export function RedStrikeThrough({
  className = "",
  delay = 0.3,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      className={`absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-8 overflow-visible pointer-events-none ${className}`}
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M2 13.5C45 9.5 160 11.5 238 12.5"
        stroke="#9C3C35"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function RedCheckmark({
  className = "",
  delay = 0.5,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      className={`w-5 h-5 inline-block text-[#9C3C35] ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M4 13.5L9.5 18.5L20 6"
        stroke="#9C3C35"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      />
    </svg>
  );
}

export function HandwrittenAnnotation({
  text,
  className = "",
  delay = 0.6,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 3, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`inline-block font-serif italic text-[#9C3C35] text-sm md:text-base select-none pointer-events-none ${className}`}
    >
      {text}
    </motion.span>
  );
}
