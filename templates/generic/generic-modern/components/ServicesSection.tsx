import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function ServicesSection() {
  const siteData = getSiteData();
  const services = siteData.services || [];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Our Primary Services</h2>
          <p className="mt-4 text-slate-600 text-base">Comprehensive solutions designed to deliver top-tier results for your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((svc, idx) => (
              <div key={idx} className="bg-slate-50 hover:bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{svc.name}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{svc.description || 'Professional service tailored to client requirements.'}</p>
                {svc.priceRange && (
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                    {svc.priceRange}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-500">
              Contact us for custom service packages tailored to your needs.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
