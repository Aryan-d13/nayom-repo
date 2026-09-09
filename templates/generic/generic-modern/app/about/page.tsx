import React from 'react';
import { getSiteData } from '../../lib/site-data';

export default function AboutPage() {
  const siteData = getSiteData();

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">About {siteData.site.name}</h1>
      <p className="text-lg text-slate-700 leading-relaxed mb-8">
        {siteData.about.summary}
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment</h2>
        <p className="text-slate-600 leading-relaxed">
          We strive to provide top-quality service, exceptional customer care, and trustworthy solutions tailored to your unique requirements.
        </p>
      </div>
    </div>
  );
}
