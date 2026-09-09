import type { Metadata } from "next";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import "./globals.css";
import { siteMetadata } from "@/data/content";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  authors: [...siteMetadata.authors],
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-[#E7E6DF] antialiased selection:bg-[#8096C7] selection:text-[#090A0F] relative overflow-x-hidden font-sans">
        <div className="fixed inset-0 pointer-events-none noise-overlay z-50 opacity-40" />
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
