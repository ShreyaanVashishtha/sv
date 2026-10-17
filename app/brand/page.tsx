import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandGuidelinesClient } from '@/components/BrandGuidelinesClient';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContent();
  const siteName = data.settings?.siteName || 'sv7.dev';
  return {
    title: `Brand Guidelines | ${siteName}`,
    description:
      'Official brand assets, logo specifications, color system, and usage guidelines for sv7.dev (Shreyaan Vashishtha).',
    alternates: {
      canonical: `${data.settings?.canonicalUrl || 'https://sv7.dev'}/brand`,
    },
  };
}

export default async function BrandPage() {
  const data = await getContent();
  const siteName = data.settings?.siteName || 'sv7.dev';
  const brandTitle = data.settings?.header?.brandTitle || 'sv7.dev';

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar
        status={data.profile.status}
        siteName={siteName}
        cvUrl={data.settings?.cvUrl}
        headerSettings={data.settings?.header}
      />

      {/* Main Content Stage */}
      <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Breadcrumb / Return */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Client Guidelines System */}
        <BrandGuidelinesClient
          siteName={siteName}
          brandTitle={brandTitle}
        />
      </main>

      {/* Global Footer (With Brand Guidelines link) */}
      <Footer
        siteName={siteName}
        footerSettings={data.settings?.footer}
        footerNote={data.settings?.footerNote}
      />
    </div>
  );
}
