import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#171817",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Common Ground Auto | Independent Auto Repair — Denver, CO",
  description:
    "Know what's wrong. Know what's next. Honest mechanical diagnostics, brake repairs, engine service, and scheduled maintenance. 1842 Larimer Street, Denver.",
  keywords: [
    "auto repair Denver",
    "independent mechanic Denver",
    "brakes Denver",
    "check engine diagnostics",
    "car maintenance Larimer Street",
  ],
  authors: [{ name: "Common Ground Auto" }],
  openGraph: {
    title: "Common Ground Auto | Know What's Wrong",
    description:
      "Repairs, maintenance, and diagnostics for the cars that get you through the week. Denver, Colorado.",
    type: "website",
    locale: "en_US",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable} antialiased`}
    >
      <body className="min-h-screen bg-asphalt text-road-white flex flex-col font-sans selection:bg-signal-red selection:text-white">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
