import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function Navbar() {
  const siteData = getSiteData();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-xl text-blue-600 tracking-tight">
          {siteData.site.name}
        </a>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="/services" className="hover:text-blue-600 transition-colors">Services</a>
          <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </nav>

        <a
          href="/contact"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm transition-colors"
        >
          {siteData.hero.cta || 'Get in Touch'}
        </a>
      </div>
    </header>
  );
}
