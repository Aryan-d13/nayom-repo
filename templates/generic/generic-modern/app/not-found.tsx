import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="py-32 text-center max-w-xl mx-auto px-4">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
      <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
        Return to Homepage
      </a>
    </div>
  );
}
