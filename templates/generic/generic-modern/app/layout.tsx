import React from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSiteData } from '../lib/site-data';

export const metadata = {
  title: getSiteData().site.name || 'Business Website',
  description: getSiteData().about.summary || 'Professional business website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = getSiteData();
  const jsonLd = siteData.seo?.jsonLd;

  return (
    <html lang="en">
      <head>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
