import type { Metadata, Viewport } from "next";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brightline Electric | Good work. Done right. | Portland, OR",
  description:
    "Portland, Oregon residential electrical repairs, lighting design, panel upgrades, and EV charging. We care about the work you don't notice. Call (503) 555-0174.",
  keywords: [
    "Portland electrician",
    "residential electrical repair",
    "home lighting Portland",
    "panel upgrade Beaverton",
    "EV charger installation Tigard",
    "Lake Oswego electrician",
  ],
  authors: [{ name: "Brightline Electric" }],
  openGraph: {
    title: "Brightline Electric | Residential Electrical in Portland",
    description: "Good work. Done right. Portland, Beaverton, Tigard, and Lake Oswego.",
    url: "https://brightline-electric.example",
    siteName: "Brightline Electric",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#11110F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#11110F]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,300..700;1,14..32,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#11110F] text-[#FFFFFF] antialiased selection:bg-[#BDF45B] selection:text-[#11110F]">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
