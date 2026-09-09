import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NORTH AIR — Heating & Cooling | Nashville, Tennessee",
  description:
    "Heating, cooling and indoor air service for the spaces you spend your life in. You should feel good at home.",
  keywords: [
    "HVAC Nashville",
    "Air Conditioning Nashville",
    "Heating Repair Tennessee",
    "Indoor Air Quality",
    "North Air Heating and Cooling",
  ],
  openGraph: {
    title: "NORTH AIR — Heating & Cooling",
    description: "You should feel good at home. Heating, cooling and indoor air in Nashville, TN.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased bg-[#F4F1E9] text-[#202321] selection:bg-[#202321] selection:text-[#F4F1E9]">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
