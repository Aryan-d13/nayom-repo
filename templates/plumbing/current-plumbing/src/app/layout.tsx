import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
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
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

import { siteMetadata } from "@/data/content";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-[#F3EFE7] text-[#17252A] font-sans antialiased selection:bg-[#DDF0EC] selection:text-[#17252A] overflow-x-hidden">
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
