'use client';

import React from 'react';
import Link from 'next/link';
import { FooterSettings } from '@/types/content';

import { BrandLogo } from '@/components/BrandLogo';

interface FooterProps {
  footerNote?: string;
  siteName?: string;
  footerSettings?: FooterSettings;
  showLegalLinks?: boolean;
}

export function Footer({
  footerNote,
  siteName,
  footerSettings,
  showLegalLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightName = footerSettings?.copyrightName || 'Shreyaan Vashishtha';
  const displayNote =
    footerSettings?.footerNote ||
    footerNote ||
    'Crafted with precision for sv7.dev. Mechanical & Aerospace Engineering @ HKUST.';
  const customLinks = (footerSettings?.customLinks || []).filter(
    (link) => link.url !== '/brand' && link.url !== '/brand/'
  );

  // Default to true unless explicitly disabled
  const shouldShowLegal =
    showLegalLinks !== undefined
      ? showLegalLinks
      : footerSettings?.showLegalLinks !== false;

  const legalLinks = [
    { name: 'Brand Guidelines', href: '/brand' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Legal Notice', href: '/legal' },
  ];

  return (
    <footer className="py-12 border-t border-white/5 bg-black/60 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        {/* Brand & Copyright */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <BrandLogo style="tc1-balanced" className="w-5 h-5 rounded-md p-0.5" />
            <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">
              {siteName || 'sv7.dev'}
            </span>
          </Link>
          <span className="text-zinc-600">•</span>
          <span>© {currentYear} {copyrightName}. All rights reserved.</span>
        </div>

        {/* Legal & Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          {shouldShowLegal &&
            legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}

          {customLinks.length > 0 &&
            customLinks.map((link, idx) => {
              const isInternal =
                link.url.startsWith('/') || link.url.startsWith('#');
              if (isInternal) {
                return (
                  <Link
                    key={idx}
                    href={link.url}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>{link.name}</span>
                </a>
              );
            })}
        </div>

        {/* Tagline / Disclaimer */}
        <p className="text-zinc-500 text-center md:text-right max-w-sm text-[11px] leading-relaxed">
          {displayNote}
        </p>
      </div>
    </footer>
  );
}
