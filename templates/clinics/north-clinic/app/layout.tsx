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

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NORTH — Private Medical Clinic · Brooklyn",
  description:
    "Thoughtful primary and preventive care for the people who live around here. A quiet place in a busy city. 91 Kent Avenue, Brooklyn.",
  openGraph: {
    title: "NORTH — Private Medical Clinic · Brooklyn",
    description:
      "Thoughtful primary and preventive care in Brooklyn, New York. We have time for you.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F1EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-ivory text-ink antialiased font-sans selection:bg-sage selection:text-white min-h-screen">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
