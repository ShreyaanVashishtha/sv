'use client';

import React from 'react';
import { FooterSettings } from '@/types/content';

interface FooterProps {
  footerNote?: string;
  siteName?: string;
  footerSettings?: FooterSettings;
}

export function Footer({ footerNote, siteName, footerSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightName = footerSettings?.copyrightName || 'Shreyaan Vashishtha';
  const displayNote = footerSettings?.footerNote || footerNote || 'Crafted with precision for sv7.dev. Mechanical & Aerospace Engineering @ HKUST.';
  const customLinks = footerSettings?.customLinks || [];

  return (
    <footer className="py-12 border-t border-white/5 bg-black/60">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400 font-semibold">{siteName || 'sv7.dev'}</span>
          <span>•</span>
          <span>© {currentYear} {copyrightName}.</span>
        </div>

        {customLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {customLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

        <p className="text-zinc-500 text-center sm:text-right">
          {displayNote}
        </p>
      </div>
    </footer>
  );
}
