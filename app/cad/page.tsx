import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CADShowcaseClient } from '@/components/CADShowcaseClient';
import Link from 'next/link';
import { ArrowLeft, Box, Compass, Sparkles } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContent();
  const siteName = data.settings?.siteName || 'sv7.dev';
  return {
    title: `3D CAD Lab & Mechanical Assemblies | ${siteName}`,
    description:
      'Interactive 3D WebGL models, rocketry recovery modules, and precision aerospace mechanical assemblies engineered by Shreyaan Vashishtha.',
    alternates: {
      canonical: `${data.settings?.canonicalUrl || 'https://sv7.dev'}/cad`,
    },
  };
}

export default async function CADPage() {
  const data = await getContent();
  const title = data.cadSettings?.title || 'CAD Lab & Mechanical Assemblies';
  const subtitle =
    data.cadSettings?.subtitle && data.cadSettings.subtitle !== 'TO BE UPDATED'
      ? data.cadSettings.subtitle
      : 'Interactive 3D WebGL assemblies, parametric rocketry mechanisms, and STL models engineered in Autodesk Fusion 360.';
  const models = data.models || [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar
        status={data.profile.status}
        siteName={data.settings.siteName}
        cvUrl={data.settings.cvUrl}
        headerSettings={data.settings.header}
      />

      {/* Main CAD Showcase Stage */}
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

        {/* Page Header */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Box className="w-3 h-3" />
              <span>Aerospace CAD Lab</span>
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              WebGL 3D Interactive Viewport
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              SolidWorks &amp; Fusion 360 Assemblies
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-archivo tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Interactive Client Showcase */}
        <CADShowcaseClient initialModels={models} cadSettings={data.cadSettings} />
      </main>

      {/* Footer */}
      <Footer
        siteName={data.settings.siteName}
        footerNote={data.settings.footerNote}
        footerSettings={data.settings.footer}
      />
    </div>
  );
}
