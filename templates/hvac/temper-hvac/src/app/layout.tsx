import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEMPER — Heating & Air | Phoenix, Arizona",
  description: "Feels better in here. Thoughtful air conditioning, heating, and indoor air comfort for homes across Phoenix, Arizona.",
  keywords: [
    "HVAC Phoenix",
    "Air Conditioning Phoenix",
    "AC Repair Phoenix",
    "Residential Heating",
    "Indoor Air Quality Arizona",
    "Temper Heating and Air",
  ],
  authors: [{ name: "TEMPER Heating & Air" }],
  openGraph: {
    title: "TEMPER — Heating & Air | Phoenix, Arizona",
    description: "Feels better in here. Thoughtful air conditioning, heating, and indoor air comfort for homes across Phoenix, Arizona.",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E9D9BE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased selection:bg-terracotta selection:text-white">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
