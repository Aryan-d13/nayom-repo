import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSiteData } from '../lib/site-data';
import CustomCursor from '../components/CustomCursor';
import AudioEffects from '../components/AudioEffects';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteData = getSiteData();
  return {
    metadataBase: new URL('https://localhost:3000'),
    title: `${siteData.site.name} // ${siteData.site.tagline}`,
    description: siteData.seo?.description || siteData.hero.subtitle,
    keywords: siteData.seo?.keywords || ['cyber brutalist', 'systems architect', 'portfolio', 'webgl'],
    authors: [{ name: siteData.site.name }],
    openGraph: {
      title: `${siteData.site.name} // ${siteData.site.tagline}`,
      description: siteData.seo?.description || siteData.hero.subtitle,
      type: 'website',
      images: [
        {
          url: '/preview/thumbnail.svg',
          width: 1200,
          height: 630,
          alt: siteData.site.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteData.site.name} // ${siteData.site.tagline}`,
      description: siteData.seo?.description || siteData.hero.subtitle,
    },
  };
}

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
      <body className="min-h-[100dvh] bg-[#050505] text-[#FFFFFF] font-sans antialiased overflow-x-hidden relative selection:bg-[#FFE600] selection:text-[#050505]">
        {/* Custom Cyber Interactive Elements */}
        <CustomCursor />
        <AudioEffects />

        {/* Rotated Edge Tab (Right Viewport Edge) */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-[calc(50%-12px)] rotate-90 z-30 hidden lg:flex items-center gap-2 bg-[#FFE600] text-[#050505] px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase border border-[#050505] shadow-lg pointer-events-auto cursor-pointer select-none hover:bg-[#FFFFFF] transition-colors">
          <span className="inline-block w-1.5 h-1.5 bg-[#050505] rounded-full animate-ping" />
          <span>SYS.SPEC // {siteData.site.systemVersion}</span>
        </div>

        {/* Main Application Flow */}
        <main className="relative flex flex-col w-full min-h-[100dvh]">
          {children}
        </main>
      </body>
    </html>
  );
}
