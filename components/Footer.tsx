'use client';

import React from 'react';
import Link from 'next/link';
import { FooterSettings } from '@/types/content';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowUp } from 'lucide-react';

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

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="pt-14 pb-12 border-t border-white/10 bg-black/70 relative z-10">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        {/* Main Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Mission Tagline */}
          <div className="space-y-3 max-w-md">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <BrandLogo style="tc1-balanced" className="w-6 h-6 rounded-lg p-1" />
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                {siteName || 'sv7.dev'}
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {displayNote}
            </p>
          </div>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-400">
            {shouldShowLegal &&
              legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors whitespace-nowrap"
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
                      className="hover:text-white transition-colors whitespace-nowrap"
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
                    className="hover:text-white transition-colors whitespace-nowrap inline-flex items-center gap-1"
                  >
                    <span>{link.name}</span>
                  </a>
                );
              })}
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} {copyrightName}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
