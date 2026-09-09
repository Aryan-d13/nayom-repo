import type { Metadata } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

import { siteMetadata } from "@/data/content";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  authors: siteMetadata.authors,
  openGraph: {
    title: siteMetadata.openGraph.title,
    description: siteMetadata.openGraph.description,
    url: siteMetadata.openGraph.url,
    siteName: siteMetadata.openGraph.siteName,
    locale: siteMetadata.openGraph.locale,
    type: siteMetadata.openGraph.type,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${caveat.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased text-[#20231F] bg-[#F5F1E8] selection:bg-[#E5B84C]/30 selection:text-[#20231F] min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
