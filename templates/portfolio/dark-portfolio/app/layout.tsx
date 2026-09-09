import React from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSiteData } from '../lib/site-data';

export const metadata = {
  title: `${getSiteData().site.name} | ${getSiteData().site.tagline || getSiteData().site.niche}`,
  description: getSiteData().hero.subtitle,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = getSiteData();
  const jsonLd = siteData.seo?.jsonLd;

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
