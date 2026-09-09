import React from 'react';
import { getSiteData } from '../../lib/site-data';

export default function ContactPage() {
  const siteData = getSiteData();

  return (
    <div className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">Get in Touch</h1>
        <p className="mt-3 text-slate-600 text-lg">We would love to hear from you. Fill out the form or reach out directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Details</h2>
          <div className="space-y-4 text-slate-700">
            {siteData.contact.phone && (
              <div>
                <span className="font-semibold block text-sm text-slate-500 uppercase">Phone</span>
                <p className="text-lg font-medium">{siteData.contact.phone}</p>
              </div>
            )}
            {siteData.contact.email && (
              <div>
                <span className="font-semibold block text-sm text-slate-500 uppercase">Email</span>
                <p className="text-lg font-medium">{siteData.contact.email}</p>
              </div>
            )}
            {siteData.contact.address && (
              <div>
                <span className="font-semibold block text-sm text-slate-500 uppercase">Address</span>
                <p className="text-lg font-medium">{siteData.contact.address}</p>
              </div>
            )}
            {siteData.contact.businessHours && (
              <div>
                <span className="font-semibold block text-sm text-slate-500 uppercase">Business Hours</span>
                <p className="text-lg font-medium">{siteData.contact.businessHours}</p>
              </div>
            )}
          </div>
        </div>

        <form className="space-y-6 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
            <input type="text" placeholder="Your Full Name" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
            <textarea rows={4} placeholder="How can we help you?" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" required></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
