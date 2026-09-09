import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function FaqSection() {
  const siteData = getSiteData();
  const faqs = siteData.faqs || [];

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-slate-600">Find answers to common questions about our services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
