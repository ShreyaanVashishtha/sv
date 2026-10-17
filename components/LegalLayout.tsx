'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Scale, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WebsiteData } from '@/types/content';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  documentType: string;
  lastUpdated: string;
  activeSlug: 'terms' | 'privacy' | 'legal';
  data: WebsiteData;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  subtitle,
  documentType,
  lastUpdated,
  activeSlug,
  data,
  children,
}: LegalLayoutProps) {
  const tabs = [
    {
      slug: 'terms',
      name: 'Terms of Service',
      href: '/terms',
      icon: Scale,
      desc: 'Usage terms, intellectual property & licensing',
    },
    {
      slug: 'privacy',
      name: 'Privacy Policy',
      href: '/privacy',
      icon: ShieldCheck,
      desc: 'Data practices, telemetry & privacy rights',
    },
    {
      slug: 'legal',
      name: 'Legal Notice',
      href: '/legal',
      icon: FileText,
      desc: 'Ownership, regulatory & academic disclaimers',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-white/20 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Top Background Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Navbar */}
      <Navbar
        status={data.profile.status}
        siteName={data.settings.siteName}
        cvUrl={data.settings.cvUrl}
        headerSettings={data.settings.header}
      />

      {/* Hero Header */}
      <main className="flex-1 pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Title & Badge */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-300">
              {documentType}
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              Jurisdiction: Hong Kong SAR
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              Effective: {lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-archivo tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {/* Quick Tab Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSlug === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 group ${
                    isActive
                      ? 'bg-zinc-900 border-white/30 text-white shadow-lg shadow-white/5'
                      : 'bg-zinc-950/50 border-white/5 hover:border-white/15 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-zinc-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>{tab.name}</span>
                      {isActive && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {tab.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </header>

        {/* Document Content Container */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-10">
          {children}

          {/* Contact / Inquiries Box */}
          <div className="pt-8 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Questions or Licensing Requests?</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  For inquiries regarding terms, photography licensing, commercial reproduction, or personal data requests, reach out directly.
                </p>
              </div>

              <a
                href="mailto:contact@sv7.dev"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all shrink-0 shadow-md"
              >
                <span>contact@sv7.dev</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Site Footer */}
      <Footer
        siteName={data.settings.siteName}
        footerNote={data.settings.footerNote}
        footerSettings={data.settings.footer}
      />
    </div>
  );
}
