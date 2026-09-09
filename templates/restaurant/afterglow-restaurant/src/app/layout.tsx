import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Inter, Caveat } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

import { siteMetadata } from "@/data/content";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.openGraph.title,
    description: siteMetadata.openGraph.description,
    type: siteMetadata.openGraph.type,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} ${dmSerif.variable} ${caveat.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#171514] text-[#E9E2D4] antialiased selection:bg-[#702F35] selection:text-[#F7F2E8] font-sans"
      >
        <ReactLenis
          root
          options={{
            duration: 1.25,
            smoothWheel: true,
            wheelMultiplier: 1.05,
            touchMultiplier: 1.5,
          }}
        >
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}

