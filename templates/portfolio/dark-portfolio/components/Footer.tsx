import React from 'react';
import { getSiteData } from '../lib/site-data';

export default function Footer() {
  const siteData = getSiteData();
  const socials = Object.entries(siteData.socialLinks || {});

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a10] py-12 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-bold text-slate-200">{siteData.site.name}</span>
          <span className="ml-2 font-mono text-xs text-slate-500">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {socials.length > 0 && (
          <div className="flex items-center gap-4">
            {socials.map(([platform, url], idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase font-mono text-slate-400 hover:text-sky-400 transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
