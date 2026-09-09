import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";

import { siteMetadata } from "@/data/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  openGraph: siteMetadata.openGraph,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <body className="antialiased min-h-screen bg-[#F5F1E8] text-[#202321] selection:bg-[#A85F45] selection:text-[#F5F1E8]">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
