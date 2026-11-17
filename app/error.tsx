'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Handled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-hidden px-6">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="h-12" />

      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
          <AlertCircle className="w-7 h-7 text-rose-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Something went wrong
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          An unexpected interface anomaly occurred while rendering this view. You can reload the component or return to the main dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all shadow-md active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-all hover:bg-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-zinc-600 font-mono">
        <span>sv7.dev &bull; System Resilience</span>
      </footer>
    </div>
  );
}
