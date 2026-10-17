import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getContent } from '@/lib/content';

export const metadata: Metadata = {
  title: '404 — Page Not Found | sv7.dev',
  description: 'This page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const currentYear = new Date().getFullYear();
  let siteName = 'sv7.dev';
  try {
    const data = await getContent();
    if (data.settings?.siteName) {
      siteName = data.settings.siteName;
    }
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden">
      {/* Subtle radial ambient glow centered behind 404 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Spacer to achieve perfect vertical centering without top header */}
      <div className="h-12" />

      {/* Main Center Stage: 404 & Return to Home */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-8xl sm:text-9xl md:text-[170px] font-black font-archivo tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 leading-none select-none">
          404
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base font-normal mt-4 mb-8">
          This page could not be found.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,255,255,0.12)] group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return to Home</span>
        </Link>
      </main>

      {/* Minimal Footer Stamp */}
      <footer className="py-8 text-center text-xs text-zinc-600 font-mono">
        <span>© {currentYear} {siteName}</span>
      </footer>
    </div>
  );
}
