'use client';

import React, { useState, useEffect } from 'react';
import { getSiteData } from '../lib/site-data';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import MarqueeBanner from '../components/MarqueeBanner';
import About from '../components/About';
import ExpertiseBento from '../components/ExpertiseBento';
import LogoTicker from '../components/LogoTicker';
import ProjectShowcase from '../components/ProjectShowcase';
import Testimonials from '../components/Testimonials';
import ContactFooter from '../components/ContactFooter';
import ContactModal from '../components/ContactModal';

export default function HomePage() {
  const siteData = getSiteData();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Unmount loader completely after animation completes
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Full Viewport Geometric Wipe Loader */}
      {showLoader && (
        <div
          className="fixed inset-0 z-50 bg-[#FFE600] flex flex-col items-center justify-center animate-loader-wipe pointer-events-none select-none"
        >
          <div className="flex flex-col items-center gap-4 text-[#050505] p-6 text-center">
            <div className="w-12 h-12 border-4 border-[#050505] border-t-transparent rounded-full animate-spin" />
            <span className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">
              INITIALIZING {siteData.site.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              {siteData.site.systemVersion} // KINETIC RUNTIME
            </span>
          </div>
        </div>
      )}

      {/* Main App Bar Navigation */}
      <Navigation siteData={siteData} />

      {/* Hero Section */}
      <Hero
        siteData={siteData}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Section Transition Ribbon 01: Hazard Marquee */}
      <MarqueeBanner
        items={[
          '/// SYSTEM OVERRIDE',
          'HIGH PERFORMANCE ARCHITECTURE',
          'ZERO COMPROMISE COMPUTE',
          'SUB-MILLISECOND LATENCY',
          'AVANT-GARDE CHOREOGRAPHY',
        ]}
        variant="hazard"
        speed="normal"
      />

      {/* About & Live Telemetry Terminal */}
      <About siteData={siteData} />

      {/* Capabilities & Full Cyber Yellow Bento Section */}
      <ExpertiseBento siteData={siteData} />

      {/* Visual Resting Point: Partner Tech Marquee */}
      <LogoTicker siteData={siteData} />

      {/* Core Showcase: Alternating Canvas Case Studies */}
      <ProjectShowcase siteData={siteData} />

      {/* Section Transition Ribbon 02: Checker Marquee */}
      <MarqueeBanner
        items={[
          '/// FIELD TELEMETRY VERIFIED',
          '100% PRODUCTION UP-TIME',
          'GLOBAL DISTRIBUTED NODES',
          'ZERO DOWNTIME CUTOVER',
        ]}
        variant="checker"
        speed="normal"
        reverse
      />

      {/* Testimonials / Field Reports */}
      <Testimonials siteData={siteData} />

      {/* Split Footer + FAQ Accordion + Massive CTA */}
      <ContactFooter
        siteData={siteData}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Global Contact Transmission Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        siteData={siteData}
      />
    </>
  );
}
