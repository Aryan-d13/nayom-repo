import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function TestimonialsSection() {
  const siteData = getSiteData();
  const testimonials = siteData.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Client Testimonials</h2>
          <p className="mt-4 text-slate-400">See what our customers have to say about their experience working with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex flex-col justify-between">
              <p className="text-slate-300 text-sm italic mb-4">"{t.quote}"</p>
              <div className="flex items-center justify-between border-t border-slate-700/80 pt-4">
                <span className="text-white font-semibold text-sm">{t.author || 'Satisfied Client'}</span>
                {t.rating && (
                  <span className="text-yellow-400 text-xs font-bold">★ {t.rating} / 5</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
