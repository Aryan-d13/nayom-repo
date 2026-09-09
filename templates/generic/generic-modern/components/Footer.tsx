import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function Footer() {
  const siteData = getSiteData();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">{siteData.site.name}</h3>
          <p className="text-sm text-slate-400">{siteData.about.summary}</p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Contact Info</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            {siteData.contact.phone && <li>Phone: {siteData.contact.phone}</li>}
            {siteData.contact.email && <li>Email: {siteData.contact.email}</li>}
            {siteData.contact.address && <li>Address: {siteData.contact.address}</li>}
            {siteData.contact.businessHours && <li>Hours: {siteData.contact.businessHours}</li>}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {siteData.site.name}. All rights reserved. Built with Nayom Automation.
      </div>
    </footer>
  );
}
